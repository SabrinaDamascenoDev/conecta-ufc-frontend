import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type LoginSchemaData, loginSchema } from "./schema";
import { NavagateBar } from "../components/NavegateBar";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  function onSubmit(data: LoginSchemaData) {
    console.log(data);
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-2 bg-white">
        <div className="w-full max-w-md">
          <NavagateBar />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo(a) de volta!
          </h1>

          <p className="text-gray-500 text-sm mb-8">
            Acesse com seu email institucional para ter acesso às melhores
            oportunidades!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Email Institucional
              </label>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Mail size={16} className="text-gray-400 shrink-0" />

                <input
                  type="email"
                  placeholder="email@alu.ufc.br"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">
                Senha
              </label>

              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock size={16} className="text-gray-400 shrink-0" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                  {...register("senha")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.senha.message}
                </p>
              )}

              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-ufc hover:bg-blue-900 text-white font-medium py-4 rounded-xl transition-colors mt-2"
            >
              Entrar na plataforma
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}