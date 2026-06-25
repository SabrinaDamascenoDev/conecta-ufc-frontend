// src/pages/Alertas.tsx
import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "../components/Sidebar";
import { SearchBar } from "../components/Search";
import { ProgramaFilter } from "../components/Filter";
import { VagaCard } from "../components/VagaCard";
import { SortDropdown } from "../components/SortDropdown";
import { Pagination } from "../components/Pagination";
import { type AdvancedFilters } from "../components/FilterSheet";
import { type Programa, PROGRAMA_PARA_TIPO } from "@/hooks/useOportunidades";
import { useAlertas } from "@/hooks/useAlertas"; // <-- AQUI ENTRA O NOVO HOOK
import { useFavoritos } from "@/context/FavoritosContext";
import Sair from "../components/Dialogs/Sair";
import notFound from "@/assets/not-found.svg";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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

const FAIXA_PARA_REMUNERACAO: Record<string, { min?: number; max?: number }> = {
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

  const hasOpenEnd = faixas.some((f) => FAIXA_PARA_REMUNERACAO[f]?.max == null);

  return {
    remuneracao_min: mins.length > 0 ? Math.min(...mins) : undefined,
    remuneracao_max:
      !hasOpenEnd && maxs.length > 0 ? Math.max(...maxs) : undefined,
  };
}

export function Alertas() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FilterOption>("Todas");
  const [sort, setSort] = useState<SortValue>("recentes");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    programas: [],
    origem: [],
    valor: [],
    prazo: [],
  });

  const debouncedSearch = useDebounce(search, 400);
  const { toggleFavorito } = useFavoritos();
  
  // Usando a mesma estrutura do Vagas, mas com o hook de Alertas
  const { vagas, loading, error, meta, goToPage, setParams } = useAlertas();

  useEffect(() => {
    const tipo: string | undefined = (() => {
      if (advancedFilters.programas.length === 1)
        return PROGRAMA_PARA_TIPO[advancedFilters.programas[0]] ?? undefined;
      if (advancedFilters.programas.length === 0 && filtro !== "Todas")
        return PROGRAMA_PARA_TIPO[filtro] ?? undefined;
      return undefined;
    })();

    const origem =
      advancedFilters.origem.length === 1
        ? advancedFilters.origem[0]
        : undefined;

    const { remuneracao_min, remuneracao_max } = resolveRemuneracao(
      advancedFilters.valor,
    );

    setParams({
      busca: debouncedSearch || undefined,
      tipo,
      origem,
      remuneracao_min,
      remuneracao_max,
    });
  }, [
    debouncedSearch,
    filtro,
    advancedFilters.programas,
    advancedFilters.origem,
    advancedFilters.valor,
    setParams
  ]);

  const handleSave = useCallback(
    async (id: number) => {
      await toggleFavorito(id);
    },
    [toggleFavorito],
  );

 const vagasOrdenadas = [...vagas].sort((a, b) => {
    // Validação extra para a data não ser undefined
    const dateA = a.dataCriacao instanceof Date ? a.dataCriacao.getTime() : 0;
    const dateB = b.dataCriacao instanceof Date ? b.dataCriacao.getTime() : 0;
    
    // Validação extra pro titulo não ser undefined e dar erro no localeCompare
    const tituloA = a.titulo || "";
    const tituloB = b.titulo || "";

    switch (sort) {
      case "recentes":
        return dateA - dateB;
      case "antigas":
        return dateB - dateA;
      case "az":
        return tituloA.localeCompare(tituloB, "pt-BR");
      case "za":
        return tituloB.localeCompare(tituloA, "pt-BR");
      default:
        return 0;
    }
  });

  const navigate = useNavigate();

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
                  Carregando alertas…
                </span>
              ) : (
                <>
                  <span className="text-foreground">{meta.total_elements}</span>{" "}
                  {meta.total_elements === 1
                    ? "alerta encontrado"
                    : "alertas encontrados"}
                </>
              )}
            </p>
            <SortDropdown
              value={sort}
              onChange={(v) => setSort(v as SortValue)}
            />
          </div>

          {error && !loading && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-5 py-4">
              Não foi possível carregar os alertas:{" "}
              <strong>{error}</strong>
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
                  vaga={vaga}
                  onSave={handleSave}
                  onSaberMais={(id) => navigate(`/vaga/${id}`)}
                />
              ))}
            </div>
          )}

          {!loading && !error && vagasOrdenadas.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <img
                src={notFound}
                alt="Nenhum alerta encontrado"
                className="w-80 md:w-96 mb-8 opacity-80"
              />
              <p className="text-2xl font-bold text-black">
                Nenhum alerta encontrado
              </p>
              <p className="text-base mt-2 text-gray-500">
                Tente ajustar os filtros ou a busca
              </p>
            </div>
          )}

          {!error && (
            <Pagination
              meta={meta}
              onPageChange={goToPage}
              disabled={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}