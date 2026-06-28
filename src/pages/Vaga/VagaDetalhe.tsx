// src/pages/VagaDetalhe.tsx
import { useParams, useNavigate } from "react-router-dom";
import {
  BookmarkIcon,
  Clock,
  ExternalLink,
  ChevronRight,
  UserCheck,
  DollarSign,
  HeartHandshake,
  Award,
  GraduationCap,
  FlaskConical,
  MicroscopeIcon,
  Monitor,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "../components/Sidebar";
import Sair from "../components/Dialogs/Sair";
import { useOportunidades, type VagaMapeada, type Programa } from "@/hooks/useOportunidades";
import { useFavoritos } from "@/context/FavoritosContext";

function ProgramaIcon({ programa }: { programa: Programa }) {
  const base =
    "w-13 h-13 rounded-xl flex items-center justify-center bg-[#dce8f7] shrink-0";
  if (programa === "PID")   return <div className={base}><GraduationCap size={24} className="text-[#00488C]" /></div>;
  if (programa === "PIBIC") return <div className={base}><FlaskConical   size={24} className="text-[#00488C]" /></div>;
  if (programa === "P&D")   return <div className={base}><MicroscopeIcon size={24} className="text-[#00488C]" /></div>;
  return                           <div className={base}><Monitor        size={24} className="text-[#00488C]" /></div>;
}

function encerraColor(dias: number) {
  if (dias <= 5)  return "text-[#FF1519]";
  if (dias <= 10) return "text-orange-400";
  return "text-green-600";
}

function EditalPlaceholder({ link }: { link: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-[#00488C] underline text-[13px] hover:opacity-80 transition-opacity"
    >
      <FileText size={13} />
      Consultar edital
    </a>
  );
}

export function VagaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vagas, loading } = useOportunidades();
  const { favoritosIds, toggleFavorito } = useFavoritos();

  const vaga: VagaMapeada | undefined = vagas.find((v) => v.id === Number(id));

  const salvo = vaga ? favoritosIds.has(vaga.id) : false;

  async function handleToggleSalvo() {
    if (!vaga) return;
    await toggleFavorito(vaga.id);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400 animate-pulse">Carregando…</p>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Vaga não encontrada.</p>
      </div>
    );
  }

  const comResultados = vaga.temResultados;

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />

      <main className="flex flex-col flex-1 min-w-0 lg:pl-[262px]">
        <div className="flex items-center justify-between px-8 pt-7 pb-0 gap-4">
          <div className="pl-10 lg:pl-0 flex-1" />
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

        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-5 pl-8">
          <button
            className="hover:text-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate("/vagas")}
          >
            vagas
          </button>
          <ChevronRight size={13} />
          <span className="text-gray-700">saiba mais</span>
        </nav>

        <div className="bg-[#F2F2F2] ml-8 me-8 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-gray-100 flex-wrap">
            <div className="flex items-center gap-4">
              <ProgramaIcon programa={vaga.programa} />
              <div>
                <h1 className="text-[17px] font-bold text-gray-900 leading-snug">
                  {vaga.titulo}
                </h1>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                  <span>Publicado há {vaga.publicadoHa}</span>
                  <span>·</span>
                  <span>até {vaga.ate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                disabled={comResultados}
                className={cn(
                  "rounded-lg gap-2 text-sm font-semibold px-4 py-4",
                  comResultados
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#00488C] hover:bg-[#153f85] text-white cursor-pointer"
                )}
                onClick={() => !comResultados && window.open(vaga.link, "_blank")}
                title={comResultados ? "Inscrições encerradas" : undefined}
              >
                <ExternalLink size={14} />
                {comResultados ? "Encerrado" : "Acessar vaga"}
              </Button>
            </div>
          </div>

          {/* Banner de resultados */}
          {comResultados && (
            <div className="mx-8 mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Resultados publicados — inscrições encerradas.</p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {vaga.resultados.map((r) => (
                    <a
                      key={r.id}
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-amber-900 transition-colors"
                    >
                      {r.titulo}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="px-8 py-2 flex flex-col gap-7 mt-4">

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-9 h-9 rounded-lg bg-[#dce8f7] flex items-center justify-center shrink-0">
                  <UserCheck size={17} className="text-[#00488C]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Coordenador</p>
                  {vaga.coordenador === "Consulte o edital" ? (
                    <EditalPlaceholder link={vaga.link} />
                  ) : (
                    <p className="text-[13px] font-medium text-gray-800">{vaga.coordenador}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-9 h-9 rounded-lg bg-[#d4f0e4] flex items-center justify-center shrink-0">
                  <DollarSign size={17} className="text-[#0d7a4e]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Valor da bolsa</p>
                  <p className="text-[13px] font-medium text-gray-800">{vaga.remuneracao} / mês</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    vaga.encerraEm <= 5  ? "bg-[#FF151920]" :
                    vaga.encerraEm <= 10 ? "bg-orange-100"  : "bg-green-100"
                  )}
                >
                  <Clock size={17} className={cn(encerraColor(vaga.encerraEm))} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Encerra em</p>
                  <p className={cn("text-[13px] font-medium", encerraColor(vaga.encerraEm))}>
                    {vaga.encerraEm} dias
                  </p>
                </div>
              </div>
            </div>

            {/* Sobre a vaga */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3">Sobre a vaga</p>
              {vaga.descricao === "Consulte o edital para mais informações sobre esta oportunidade." ? (
                <p className="text-[14px] text-gray-500 leading-relaxed italic">
                  Descrição não disponível —{" "}
                  <EditalPlaceholder link={vaga.link} />
                </p>
              ) : (
                <p className="text-[14px] text-gray-700 leading-relaxed">{vaga.descricao}</p>
              )}
            </div>

            {/* Vagas disponíveis */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3">Vagas disponíveis</p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2.5 bg-[#dce8f7] text-[#00488C] rounded-lg px-4 py-2">
                  <HeartHandshake size={17} />
                  <span className="text-xl font-semibold">{vaga.vagasVoluntarias}</span>
                  <span className="text-[13px] font-medium">Voluntárias</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#d4f0e4] text-[#0d7a4e] rounded-lg px-4 py-2">
                  <Award size={17} />
                  <span className="text-xl font-semibold">{vaga.vagasRemuneradas}</span>
                  <span className="text-[13px] font-medium">Remunerada</span>
                </div>
              </div>
            </div>

            {/* Requisitos */}
            <div>
              <p className="text-xs font-medium text-gray-400 mb-3">
                Requisitos do processo seletivo
              </p>
              <div className="flex gap-3 items-start bg-gray-50 rounded-xl px-4 py-3.5">
                <FileText size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[13px] text-gray-500 italic leading-relaxed">
                  Requisitos não disponíveis nesta plataforma —{" "}
                  <EditalPlaceholder link={vaga.link} />
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              {vaga.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full bg-[#00488C] text-white text-[12px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className={cn("flex items-center gap-1.5 text-xs font-medium", encerraColor(vaga.encerraEm))}>
                <Clock size={13} />
                Encerra em {vaga.encerraEm} dias
              </span>
              <button
                onClick={handleToggleSalvo}
                className={cn(
                  "transition-colors",
                  salvo ? "text-[#00488C]" : "text-gray-300 hover:text-[#00488C]"
                )}
                title={salvo ? "Remover dos salvos" : "Salvar vaga"}
              >
                <BookmarkIcon size={22} fill={salvo ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}