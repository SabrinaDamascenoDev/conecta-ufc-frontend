import { useState, useMemo } from "react";
import { ArrowUpDown, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "../components/Sidebar";
import { SearchBar } from "../components/Search";
import { ProgramaFilter } from "../components/Filter";
import { VagaCard } from "../components/VagaCard";
import { vagas as vagasInitial, type Vaga, type Programa } from "@/mocks/mocksvagas";

type FilterOption = "Todas" | Programa;

export function Vagas() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FilterOption>("Todas");
  const [vagas, setVagas] = useState<Vaga[]>(vagasInitial);
  const [activeNav, setActiveNav] = useState<"vagas" | "salvos" | "alertas">("vagas");

  const vagasFiltradas = useMemo(() => {
    let result = vagas;

    if (activeNav === "salvos") {
      result = result.filter((v) => v.salvo);
    }

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

    return result;
  }, [vagas, filtro, search, activeNav]);

  function handleSave(id: number) {
    setVagas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, salvo: !v.salvo } : v))
    );
  }

  function handleSaberMais(id: number) {
    alert(`Abrindo detalhes da vaga #${id}`);
  }

  const pageTitle = activeNav === "salvos" ? "Salvos" : activeNav === "alertas" ? "Alertas" : "Vagas";

  return (
    <div className="flex min-h-screen bg-[#f4f6f9] font-sans">
      <Sidebar
        activeItem={activeNav}
        onNavigate={setActiveNav}
        alertasCount={10}
      />

      <main className="flex flex-col flex-1 min-w-0 lg:pl-[262px]">
        <div className="flex items-center justify-between px-8 pt-7 pb-0 gap-4">
          <div className="pl-10 lg:pl-0 flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-9 h-9 rounded-full bg-[#5b8de8] flex items-center justify-center text-xs font-bold text-white">
              SD
            </div>
            <button className="w-9 h-9 rounded-full bg-[#fde8e8] flex items-center justify-center text-[#e05252] hover:bg-[#fbd0d0] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <LogOutIcon />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 pt-6 pb-10 flex flex-col gap-5">
          {activeNav === "vagas" && (
            <ProgramaFilter selected={filtro} onChange={setFiltro} />
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{vagasFiltradas.length}</span>{" "}
              {vagasFiltradas.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-gray-600 border-gray-300 bg-white rounded-xl hover:bg-gray-50"
            >
              <ArrowUpDown size={13} />
              Mais recentes
            </Button>
          </div>

          {vagasFiltradas.length > 0 ? (
            <div className="flex flex-col gap-4">
              {vagasFiltradas.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  vaga={vaga}
                  onSave={handleSave}
                  onSaberMais={handleSaberMais}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <p className="text-base font-medium">Nenhuma vaga encontrada</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}