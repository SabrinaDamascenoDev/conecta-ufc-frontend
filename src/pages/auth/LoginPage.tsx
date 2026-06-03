import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "./components/LeftPanel";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <div className="flex-1 flex items-center justify-center p-2 bg-white">
        <div className="w-full max-w-md">
          <div className="flex gap-6 mb-8 border-b border-gray-200">
            <button className="pb-3 text-sm font-semibold text-ufc border-b-2 border-ufc">
              Entrar
            </button>
            <button
              className="pb-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => navigate("/cadastro")}
            >
              Criar Conta
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo(a) de volta!</h1>
          <p className="text-gray-500 text-sm mb-8">
            Acesse com seu email institucional para ter acesso as melhores oportunidades!
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Email Institucional</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  placeholder="email@alu.ufc.br"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Senha</label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <button className="text-xs text-blue-600 hover:underline">Esqueci minha senha</button>
              </div>
            </div>

            <button className="w-full bg-ufc hover:bg-blue-900 text-white font-medium py-4 rounded-xl transition-colors mt-2" onClick={() => navigate('/dashboard')}>
              Entrar na plataforma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}