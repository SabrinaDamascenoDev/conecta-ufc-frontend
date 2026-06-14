import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ChevronDown, SquarePen } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const programas = ["PAID", "PID", "PIBIC", "P&D", "PET", "PET-SI", "PPCA", "Extenção"];
const cursos = [
  
  "Ciência da Computação",
  "Design Digital", 
  "Engenharia de Software",
  "Engenharia da Computação",
  "Inteligencia Artificial", 
  "Redes de Computadores",
  "Sistemas de Informação",
];

interface EditarPerfilProps {
  children: React.ReactNode;
}

export function EditarPerfil({ children }: EditarPerfilProps) {
  const [nome, setNome] = useState("Sabrina Damasceno");
  const [email, setEmail] = useState("sabrinadamasceno@alu.ufc.br");
  const [curso, setCurso] = useState("Sistemas de Informação");
  const [editandoNome, setEditandoNome] = useState(false);
  const [editandoEmail, setEditandoEmail] = useState(false);
  const [showCursos, setShowCursos] = useState(false);
  const [alertasSelecionados, setAlertasSelecionados] = useState<string[]>(["PAID", "PID", "PIBIC"]);

  function toggleAlerta(p: string) {
    setAlertasSelecionados((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[520px] bg-white rounded-3xl p-8 flex flex-col gap-6 shadow-xl border-none outline-none"
      >
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-xl font-bold text-gray-900">Edite seus dados pessoais</h2>
          <p className="text-sm text-gray-400">Edite aqui todos os seus dados pessoais</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Nome</label>
          <div
            className={cn(
              "flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-50 transition-all",
              editandoNome ? "border-[#003f7f] bg-white" : "border-gray-200"
            )}
          >
            {editandoNome ? (
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onBlur={() => setEditandoNome(false)}
                className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-700">{nome}</span>
            )}
            <button onClick={() => setEditandoNome(true)}>
              <SquarePen size={15} className={cn("transition-colors", editandoNome ? "text-[#003f7f]" : "text-gray-400 hover:text-[#003f7f]")} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-sm font-medium text-gray-700">Curso</label>
          <button
            onClick={() => setShowCursos((v) => !v)}
            className={cn(
              "flex items-center justify-between border rounded-xl px-4 py-3 bg-gray-50 transition-all text-left",
              showCursos ? "border-[#003f7f] bg-white" : "border-gray-200"
            )}
          >
            <span className="text-sm text-gray-700">{curso}</span>
            <ChevronDown size={15} className={cn("text-gray-400 transition-transform", showCursos && "rotate-180")} />
          </button>
          {showCursos && (
            <div className="absolute top-[72px] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
              {cursos.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurso(c); setShowCursos(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                    c === curso ? "bg-[#003f7f]/10 text-[#003f7f] font-medium" : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Email Institucional</label>
          <div
            className={cn(
              "flex items-center gap-2 border rounded-xl px-4 py-3 bg-gray-50 transition-all",
              editandoEmail ? "border-[#003f7f] bg-white" : "border-gray-200"
            )}
          >
            <Mail size={14} className="text-gray-400 shrink-0" />
            {editandoEmail ? (
              <input
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEditandoEmail(false)}
                className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
              />
            ) : (
              <span className="flex-1 text-sm text-gray-700">{email}</span>
            )}
            <button onClick={() => setEditandoEmail(true)}>
              <SquarePen size={15} className={cn("transition-colors", editandoEmail ? "text-[#003f7f]" : "text-gray-400 hover:text-[#003f7f]")} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">
            Edite quais as oportunidades você deseja receber alertas
          </label>
          <div className="flex flex-wrap gap-2">
            {programas.map((p) => {
              const ativo = alertasSelecionados.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggleAlerta(p)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
                    ativo
                      ? "bg-[#003f7f] text-white border-[#003f7f]"
                      : "bg-white text-gray-500 border-gray-300 hover:border-[#003f7f] hover:text-[#003f7f]"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-semibold text-sm cursor-pointer"
            >
              Voltar
            </Button>
          </DialogClose>
          <Button className="flex-1 h-12 rounded-xl bg-[#003f7f] hover:bg-[#002d5c] text-white font-semibold text-sm cursor-pointer">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}