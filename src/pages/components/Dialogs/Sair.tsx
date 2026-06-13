import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { loginService } from "@/services/loginServise"

export default function Sair() {

  const handleLogout = () => {
    loginService.logout();
    window.location.reload()
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-11 h-11 rounded-lg bg-[#fde8e8] flex items-center justify-center text-[#e05252] hover:bg-[#fbd0d0] transition-colors cursor-pointer">
          <LogOut size={16} />
        </button>
      </DialogTrigger>

     <DialogContent className="sm:max-w-[380px] bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-5 shadow-xl border-none outline-none">
        <div className="w-20 h-20 rounded-full bg-[#fde8e8] flex items-center justify-center">
          <LogOut size={36} className="text-[#cc0000]" />
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-900">
            Você tem certeza que deseja sair?
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Após essa ação você só consiguirá acessar sua conta novamente ao logar.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3 w-full mt-1">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-semibold text-base"
            >
              Voltar
            </Button>
          </DialogClose>

          <Button
            className="flex-1 h-12 rounded-xl bg-[#cc0000] hover:bg-[#aa0000] text-white font-semibold text-base gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sair
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}