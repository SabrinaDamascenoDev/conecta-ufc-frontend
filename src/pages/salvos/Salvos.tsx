
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { SearchBar } from "../components/Search";
import { ProgramaFilter } from "../components/Filter";
import { VagaCard } from "../components/VagaCard";
import { SortDropdown } from "../components/SortDropdown";
import { Pagination } from "../components/Pagination";
import Sair from "../components/Dialogs/Sair";
import type { AdvancedFilters } from "../components/FilterSheet";
import notFound from "@/assets/not-found.svg";
import { getFavoritos } from "@/services/vagasFavoritasService";
import {
  mapearOportunidade,
  type VagaMapeada,
  type Programa,
  type PaginationMeta,
  type OportunidadesParams,
  PROGRAMA_PARA_TIPO,
} from "@/hooks/useOportunidades";
import { useFavoritos } from "@/context/FavoritosContext";

type FilterOption = "Todas" | Programa;
type SortValue = "recentes" | "antigas" | "az" | "za";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const DEFAULT_META: PaginationMeta = {
  total_elements: 0,
  total_pages: 1,
  current_page: 1,
  size: 20,
  has_next: false,
  has_previous: false,
};

const FAIXA_PARA_REMUNERACAO: Record<
  string,
  { min?: number; max?: number }
> = {
  "Até R$ 500": { max: 500 },
  "R$ 501–R$ 700": { min: 501, max: 700 },
  "R$ 701–R$ 900": { min: 701, max: 900 },
  "Acima de R$ 900": { min: 901 },
};

function resolveRemuneracao(faixas: string[]): {
  remuneracao_min?: number;
  remuneracao_max?: number;
} {
  if (faixas.length === 0) return {};

  const mins = faixas
    .map((f) => FAIXA_PARA_REMUNERACAO[f]?.min)
    .filter((v): v is number => v != null);

  const maxs = faixas
    .map((f) => FAIXA_PARA_REMUNERACAO[f]?.max)
    .filter((v): v is number => v != null);

  const hasOpenEnd = faixas.some(
    (f) => FAIXA_PARA_REMUNERACAO[f]?.max == null
  );

  return {
    remuneracao_min: mins.length ? Math.min(...mins) : undefined,
    remuneracao_max:
      !hasOpenEnd && maxs.length ? Math.max(...maxs) : undefined,
  };
}

export function Salvos() {
  const navigate = useNavigate();
  const { favoritosIds, toggleFavorito } = useFavoritos();

  const [vagas, setVagas] = useState<VagaMapeada[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FilterOption>("Todas");
  const [sort, setSort] = useState<SortValue>("recentes");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    programas: [],
    origem: [],
    valor: [],
    prazo: [],
  });
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  // Monta os params server-side (mesmo padrão do Vagas.tsx)
 const serverParams: OportunidadesParams = (() => {
  const tipo: string | undefined = (() => {
    if (advancedFilters.programas.length === 1)
      return PROGRAMA_PARA_TIPO[advancedFilters.programas[0]] ?? undefined;

    if (
      advancedFilters.programas.length === 0 &&
      filtro !== "Todas"
    )
      return PROGRAMA_PARA_TIPO[filtro] ?? undefined;

    return undefined;
  })();

  const origem =
    advancedFilters.origem.length === 1
      ? advancedFilters.origem[0]
      : undefined;

  const { remuneracao_min, remuneracao_max } =
    resolveRemuneracao(advancedFilters.valor);

  return {
    page,
    size: 20,
    busca: debouncedSearch || undefined,
    tipo,
    origem,
    remuneracao_min,
    remuneracao_max,
  };
})();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data: raw, meta: metaApi } = await getFavoritos(serverParams);
        if (cancelled) return;

        const mapeadas = raw
          .map((o) => mapearOportunidade(o))
          .filter((v): v is VagaMapeada => v !== null)
          .map((v) => ({ ...v, salvo: true }));

        setVagas(mapeadas);
        setMeta(metaApi ?? { ...DEFAULT_META, total_elements: mapeadas.length });
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao carregar favoritos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filtro, advancedFilters, page]);

  // Volta para p.1 sempre que filtros/busca mudam
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filtro, advancedFilters]);

  const handleSave = useCallback(async (id: number) => {
    await toggleFavorito(id);
    // Remove localmente para feedback imediato (igual ao contexto)
    setVagas((prev) => prev.filter((v) => v.id !== id));
    setMeta((prev) => ({
      ...prev,
      total_elements: Math.max(prev.total_elements - 1, 0),
    }));
  }, [toggleFavorito]);

  // Ordenação local (a API não expõe parâmetro de sort)
  const vagasOrdenadas = [...vagas].sort((a, b) => {
    switch (sort) {
      case "recentes": return a.dataCriacao.getTime() - b.dataCriacao.getTime();
      case "antigas":  return b.dataCriacao.getTime() - a.dataCriacao.getTime();
      case "az":       return a.titulo.localeCompare(b.titulo, "pt-BR");
      case "za":       return b.titulo.localeCompare(a.titulo, "pt-BR");
      default:         return 0;
    }
  });

  function handleFiltroRapido(value: FilterOption) {
    setFiltro(value);
    setAdvancedFilters((prev) => ({ ...prev, programas: [] }));
  }

  function handleAdvancedFilters(filters: AdvancedFilters) {
    setAdvancedFilters(filters);
    if (filters.programas.length > 0) setFiltro("Todas");
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar alertasCount={10} />

      <main className="flex flex-col flex-1 min-w-0 lg:pl-[262px]">
        <div className="flex items-center justify-between px-8 pt-7 pb-0 gap-4">
          <div className="pl-10 lg:pl-0 flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onApplyFilters={handleAdvancedFilters}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="w-11 h-11 rounded-full bg-[#5b8de8] flex items-center cursor-pointer justify-center text-xs font-bold text-white"
              onClick={() => navigate("/perfil")}
            >
              SD
            </button>
            <Sair />
          </div>
        </div>

        <div className="px-8 pt-6 pb-10 flex flex-col gap-5">
          <ProgramaFilter selected={filtro} onChange={handleFiltroRapido} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" />
                  Carregando favoritos…
                </span>
              ) : (
                <>
                  <span className="text-foreground">{meta.total_elements}</span>{" "}
                  {meta.total_elements === 1
                    ? "oportunidade encontrada"
                    : "oportunidades encontradas"}
                </>
              )}
            </p>
            <SortDropdown value={sort} onChange={(v) => setSort(v as SortValue)} />
          </div>

          {error && !loading && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
              Não foi possível carregar os favoritos: <strong>{error}</strong>
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#F2F2F2] rounded-2xl px-6 py-5 animate-pulse h-36"
                />
              ))}
            </div>
          )}

          {!loading && !error && vagasOrdenadas.length > 0 && (
            <div className="flex flex-col gap-4">
              {vagasOrdenadas.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={{ ...vaga, salvo: favoritosIds.has(vaga.id) }}
                  onSave={handleSave}
                  onSaberMais={(id) => navigate(`/vagas/${id}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && vagasOrdenadas.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <img
                src={notFound}
                alt="Nenhuma vaga encontrada"
                className="w-80 md:w-96 mb-8 opacity-80"
              />
              <p className="text-2xl font-bold text-black">Nenhuma vaga encontrada</p>
              <p className="text-base mt-2 text-gray-500">
                Tente ajustar os filtros ou a busca
              </p>
            </div>
          )}

          {!error && (
            <Pagination meta={meta} onPageChange={setPage} disabled={loading} />
          )}
        </div>
      </main>
    </div>
  );
}