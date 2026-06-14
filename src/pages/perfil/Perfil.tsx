import { Sidebar } from "../components/Sidebar";
import Sair from "../components/Dialogs/Sair";
import { EditarPerfil } from "../components/Dialogs/EditarPeril";
import { Button } from "@/components/ui/button";
import { Mail, SquarePen } from "lucide-react";

const alertasAtivos = ["PAID", "PID", "PIBIC", "Extenção"];

export function Perfil() {
  return (
    <div className="flex min-h-screen bg-white font-sans w-full">
      <Sidebar alertasCount={10} />
      <main className="flex flex-col flex-1 min-w-0 w-full lg:pl-[262px]">

        <div className="flex items-center justify-end px-8 pt-7 pb-0 gap-2">
          <div className="w-11 h-11 rounded-full bg-[#5b8de8] flex items-center justify-center text-xs font-bold text-white">
            SD
          </div>
          <Sair />
        </div>

        <div className="px-8 pt-8 pb-10 flex flex-col gap-8 ">
          <div className="flex items-center gap-6">
            <div className="w-30 h-30 rounded-full bg-[#5b8de8]/30 flex items-center justify-center text-3xl font-bold text-[#003f7f] shrink-0">
              SD
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Sabrina Damasceno</h1>
              <p className="text-sm text-gray-400">sabrinadamasceno@alu.ufc.br</p>
              <span className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-[#003f7f] text-white text-xs font-semibold w-fit">
                Sistemas de Informação
              </span>
            </div>
            <EditarPerfil>
              <Button className="flex items-center gap-2 bg-[#003f7f] hover:bg-[#002d5c] text-white rounded-xl px-5 py-5 text-sm font-semibold shadow-sm cursor-pointer">
                <SquarePen size={15} />
                Editar Perfil
              </Button>
            </EditarPerfil>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-800 shadow-sm">
                Sabrina Damasceno
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-500">Email Institucional</label>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-800 shadow-sm flex items-center gap-2">
                <Mail size={14} className="text-gray-400 shrink-0" />
                sabrinadamasceno@alu.ufc.br
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-500">Alertas selecionados</label>
            <div className="flex flex-wrap gap-2">
              {alertasAtivos.map((a) => (
                <span
                  key={a}
                  className="px-4 py-1.5 rounded-full bg-[#003f7f] text-white text-xs font-semibold"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}