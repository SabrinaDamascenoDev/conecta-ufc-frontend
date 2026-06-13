import { BookmarkIcon, Clock, Info, GraduationCap, FlaskConical, Monitor, MicroscopeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Vaga } from "@/mocks/mocksvagas";

interface VagaCardProps {
  vaga: Vaga;
  onSave: (id: number) => void;
  onSaberMais: (id: number) => void;
}

function ProgramaIcon({ programa }: { programa: Vaga["programa"] }) {
  const base = "w-14 h-14 rounded-xl flex items-center justify-center bg-[#dce8f7]";
  if (programa === "PID") return <div className={base}><GraduationCap size={25} className="text-[#00488C]" /></div>;
  if (programa === "PIBIC") return <div className={base}><FlaskConical size={25} className="text-[#00488C]" /></div>;
  if (programa === "P&D") return <div className={base}><MicroscopeIcon size={25} className="text-[#00488C]" /></div>;
  return <div className={base}><Monitor size={25} className="text-[#00488C]" /></div>;
}

function encerraColor(dias: number) {
  if (dias <= 5) return "text-amber-500";
  if (dias <= 10) return "text-orange-400";
  return "text-green-600";
}

export function VagaCard({ vaga, onSave, onSaberMais }: VagaCardProps) {
  return (
    <div className="bg-[#F2F2F2] rounded-2xl px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <ProgramaIcon programa={vaga.programa} />
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-snug">{vaga.titulo}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Publicado há {vaga.publicadoHa} – até dia {vaga.ate}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="shrink-0 bg-[#00488C] hover:bg-[#153f85] text-white rounded-lg gap-2 text-sm font-semibold px-4 py-4 cursor-pointer"
          onClick={() => onSaberMais(vaga.id)}
        >
          <Info size={14} />
          Saber mais
        </Button>
      </div>

      {/* Body */}
      <div className="mt-4 text-sm text-gray-700 leading-relaxed space-y-0.5">
        <p>{vaga.descricao}</p>
        <p>Coodernador responsável: {vaga.coordenador}.</p>
        <p>Valor: {vaga.valor}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {vaga.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-[#00488C] hover:bg-[#00488C] text-white text-xs font-medium px-3 py-3 rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn("flex items-center gap-1.5 text-xs font-medium", encerraColor(vaga.encerraEm))}>
            <Clock size={13} />
            Encerra em {vaga.encerraEm} dias
          </span>
          <button
            onClick={() => onSave(vaga.id)}
            className={cn(
              "transition-colors",
              vaga.salvo ? "text-[#1a4fa0]" : "text-gray-400 hover:text-[#1a4fa0]"
            )}
            title={vaga.salvo ? "Remover dos salvos" : "Salvar vaga"}
          >
            <BookmarkIcon size={25} fill={vaga.salvo ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}