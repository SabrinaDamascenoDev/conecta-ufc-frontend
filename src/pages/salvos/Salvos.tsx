import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "../components/Sidebar";
import { SearchBar } from "../components/Search";
import { ProgramaFilter } from "../components/Filter";
import { VagaCard } from "../components/VagaCard";
import { vagas as vagasInitial, type Vaga, type Programa } from "@/mocks/mocksvagas";
import Sair from "../components/Dialogs/Sair";
import type { AdvancedFilters } from "../components/FilterSheet";

type FilterOption = "Todas" | Programa;

export function Salvos() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<FilterOption>("Todas");
  const [vagas, setVagas] = useState<Vaga[]>(vagasInitial);
  const vagasSalvas = useMemo(() => vagas.filter((v) => v.salvo), [vagas]);

  const vagasFiltradas = useMemo(() => {
    let result = vagas;
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
  }, [vagas, filtro, search]);

  function handleSave(id: number) {
    setVagas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, salvo: !v.salvo } : v))
    );
  }

  function handleSaberMais(id: number) {
    alert(`Abrindo detalhes da vaga #${id}`);
  }

  
  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar alertasCount={10} />
      <main className="flex flex-col flex-1 min-w-0 lg:pl-[262px]">
        <div className="flex items-center justify-between px-8 pt-7 pb-0 gap-4">
          <div className="pl-10 lg:pl-0 flex-1">
            <SearchBar value={search} onChange={setSearch} onApplyFilters={function (filters: AdvancedFilters): void {
                          throw new Error("Function not implemented.");
                      } } />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-11 h-11 rounded-full bg-[#5b8de8] flex items-center justify-center text-xs font-bold text-white">
              SD
            </div>
            <Sair />
          </div>
        </div>
        <div className="px-8 pt-6 pb-10 flex flex-col gap-5">
          <ProgramaFilter selected={filtro} onChange={setFiltro} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="text-foreground">{vagasSalvas.length}</span>{" "}
              {vagasSalvas.length === 1 ? "oportunidade encontrada" : "oportunidades encontradas"}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-gray-600 border-gray-200 py-4 px-3 bg-white rounded-xl hover:bg-gray-50"
            >
              <ArrowUpDown size={13} />
              Mais recentes
            </Button>
          </div>
          {vagasFiltradas.length > 0 && vagasFiltradas.some((v) => v.salvo) ? (
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