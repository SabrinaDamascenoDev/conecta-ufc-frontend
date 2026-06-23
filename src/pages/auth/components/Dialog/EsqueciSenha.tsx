import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import type { EsqueceuSchemaData } from "./schema";
import { esqueceuSenhaSchema } from "./schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esqueceuSenhaService } from "@/services/esqueceuSenha";
import { toast } from "sonner";

export default function EsqueceuSenha() {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [emailEnviado, setEmailEnviado] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EsqueceuSchemaData>({
    resolver: zodResolver(esqueceuSenhaSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: EsqueceuSchemaData) {
  setIsLoading(true);
  try {
    const response = await esqueceuSenhaService({
      email: data.email,
    });

    setEmailEnviado(data.email);
    setStatus("success");

    toast.success("Link enviado!");
  } catch (err) {
    console.error("ERRO:", err);

    toast.error(
      err instanceof Error
        ? err.message
        : "Erro desconhecido"
    );
  } finally {
    setIsLoading(false);
  }
}

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="text-xs font-medium text-[#003f7f] hover:underline underline-offset-2"
        >
          Esqueci minha senha
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-6 shadow-2xl border-none outline-none">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#003f7f]/10">
          <KeyRound size={26} className="text-[#003f7f]" />
        </div>

        {status === "success" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-gray-900">Link enviado!</h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Enviamos as instruções de recuperação para{" "}
                <span className="font-semibold text-gray-700">
                  {emailEnviado}
                </span>
                . Confira sua caixa de entrada e também a pasta de spam.
              </p>
            </div>

            <DialogClose asChild>
              <Button className="w-full h-12 rounded-xl bg-[#003f7f] hover:bg-[#003369] text-white font-semibold text-base" onClick={() => {setStatus('idle')}}>
                Entendi
              </Button>
            </DialogClose>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-gray-900">
                Esqueceu sua senha?
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Informe seu e-mail institucional e enviaremos um link para
                redefinição da senha.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmit)(e);
              }}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-1.5 text-left">
                <label
                  htmlFor="recovery-email"
                  className="text-sm font-medium text-gray-700"
                >
                  E-mail institucional
                </label>

                <div
                  className={`flex items-center gap-2 border rounded-xl px-4 py-3 bg-gray-50 transition-all focus-within:border-[#003f7f] focus-within:ring-2 focus-within:ring-[#003f7f]/15 ${
                    errors.email ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <Mail size={16} className="text-gray-400 shrink-0" />

                  <input
                    id="recovery-email"
                    type="email"
                    autoFocus
                    placeholder="nome@instituicao.edu.br"
                    className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex gap-3 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-base"
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl bg-[#003f7f] hover:bg-[#003369] text-white font-semibold text-base gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
