import { DialogHeader, Dialog, DialogClose, DialogContent, DialogFooter, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function Sair() {
  return (
    <Dialog>
      {/* Botão que abre o modal */}
      <DialogTrigger asChild>
        <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-border border-gray-300 bg-white shadow-sm hover:bg-gray-50"
        >
            <SlidersHorizontal size={16} className="text-muted-foreground" />
      </Button>
      </DialogTrigger>

      {/* Conteúdo do modal */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        
        {/* Aqui você coloca o corpo do modal (formulários, textos, etc.) */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Nome</span>
            <input className="col-span-3 border p-2 rounded" placeholder="Seu Nome" />
          </div>
        </div>

        {/* Rodapé e botão de fechar */}
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button type="submit">Salvar alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}