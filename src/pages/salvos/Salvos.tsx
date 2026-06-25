// src/pages/Salvos.tsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { SearchBar } from "../components/Search";
import { ProgramaFilter } from "../components/Filter";
import { VagaCard } from "../components/VagaCard";
import { SortDropdown } from "../components/SortDropdown";
import Sair from "../components/Dialogs/Sair";
import type { AdvancedFilters } from "../components/FilterSheet";
import notFound from "@/assets/not-found.svg";
import { getFavoritos } from "@/services/vagasFavoritasService";
import { mapearOportunidade, type VagaMapeada, type Programa } from "@/hooks/useOportunidades";
import { useFavoritos } from "@/context/FavoritosContext";

type FilterOption = "Todas" | Programa;
type SortValue = "recentes" | "antigas" | "az" | "za";

function parseValor(valor: string): number {
  return parseInt(valor.replace(/\D/g, ""), 10) || 0;
}

function matchValor(valor: string, faixas: string[]): boolean {
  if (faixas.length === 0) return true;
  const n = parseValor(valor);
  return faixas.some((f) => {
    if (f === "Até R$ 500") return n <= 500;
    if (f === "R$ 501–R$ 700") return n >= 501 && n <= 700;
    if (f === "R$ 701–R$ 900") return n >= 701 && n <= 900;
    if (f === "Acima de R$ 900") return n > 900;
    return false;
  });
}

function matchPrazo(encerraEm: number, prazos: string[]): boolean {
  if (prazos.length === 0) return true;
  return prazos.some((p) => {
    if (p === "Encerra em até 7 dias") return encerraEm <= 7;
    if (p === "Encerra em até 15 dias") return encerraEm <= 15;
    if (p === "Encerra em até 30 dias") return encerraEm <= 30;
    return false;
  });
}

export function Salvos() {
  const navigate = useNavigate();
  const { favoritosIds, toggleFavorito } = useFavoritos();

  const [vagas, setVagas] = useState<VagaMapeada[]>([]);
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

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const raw = await getFavoritos();
        if (cancelled) return;

        const mapeadas = raw
          .map((o) => mapearOportunidade(o))
          .filter((v): v is VagaMapeada => v !== null)
          .map((v) => ({ ...v, salvo: true }));

        setVagas(mapeadas);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao carregar favoritos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleSave = useCallback(async (id: number) => {
    await toggleFavorito(id);
  }, [toggleFavorito]);

  const vagasFiltradas = useMemo(() => {
    // Usa favoritosIds do contexto como fonte de verdade
    let result = vagas.filter((v) => favoritosIds.has(v.id));

    if (filtro !== "Todas") {
      result = result.filter((v) => v.programa === filtro);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.titulo.toLowerCase().includes(q) ||
          v.descricao.toLowerCase().includes(q) ||
          v.coordenador.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (advancedFilters.programas.length > 0) {
      result = result.filter((v) =>
        advancedFilters.programas.includes(v.programa)
      );
    }

    if (advancedFilters.valor.length > 0) {
      result = result.filter((v) =>
        matchValor(v.remuneracao, advancedFilters.valor)
      );
    }

    if (advancedFilters.prazo.length > 0) {
      result = result.filter((v) =>
        matchPrazo(v.encerraEm, advancedFilters.prazo)
      );
    }

    return [...result].sort((a, b) => {
      switch (sort) {
        case "recentes": return a.encerraEm - b.encerraEm;
        case "antigas":  return b.encerraEm - a.encerraEm;
        case "az":       return a.titulo.localeCompare(b.titulo, "pt-BR");
        case "za":       return b.titulo.localeCompare(a.titulo, "pt-BR");
        default:         return 0;
      }
    });
  }, [vagas, favoritosIds, filtro, search, sort, advancedFilters]);

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar alertasCount={10} />
      <main className="flex flex-col flex-1 min-w-0 lg:pl-[262px]">
        <div className="flex items-center justify-between px-8 pt-7 pb-0 gap-4">
          <div className="pl-10 lg:pl-0 flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              onApplyFilters={setAdvancedFilters}
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
          <ProgramaFilter selected={filtro} onChange={setFiltro} />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="text-foreground">{vagasFiltradas.length}</span>{" "}
              {vagasFiltradas.length === 1
                ? "oportunidade encontrada"
                : "oportunidades encontradas"}
            </p>
            <SortDropdown
              value={sort}
              onChange={(v) => setSort(v as SortValue)}
            />
          </div>

          {loading && (
            <p className="text-sm text-gray-400 text-center py-10">
              Carregando favoritos…
            </p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-500 text-center py-10">{error}</p>
          )}

          {!loading && !error && vagasFiltradas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {vagasFiltradas.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={{ ...vaga, salvo: favoritosIds.has(vaga.id) }}
                  onSave={handleSave}
                  onSaberMais={(id) => navigate(`/vagas/${id}`)}
                />
              ))}
            </div>
          ) : (
            !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <img
                  src={notFound}
                  alt="Nenhuma vaga encontrada"
                  className="w-80 md:w-96 mb-8 opacity-80"
                />
                <p className="text-2xl font-bold text-black">
                  Nenhuma vaga encontrada
                </p>
                <p className="text-base mt-2 text-gray-500">
                  Tente ajustar os filtros ou a busca
                </p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}