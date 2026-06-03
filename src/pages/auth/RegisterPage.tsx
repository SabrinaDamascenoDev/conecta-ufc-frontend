import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "./components/LeftPanel";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../components/ui/select";

const OPPORTUNITY_TAGS = [
  "PAID",
  "PID",
  "PIBIC",
  "P&D",
  "PET",
  "PET-SI",
  "PPCA",
  "Extenção",
];

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 mb-8 max-w-[150px]">
      <div className="flex flex-col items-center gap-1">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            step === 1 ? "bg-ufc text-white" : "bg-ufc text-white"
          }`}
        >
          {step > 1 ? <Check size={16} /> : "1"}
        </div>
        <span
          className={`text-xs font-medium ${step === 1 ? "text-ufc" : "text-gray-400"}`}
        >
          Perfil
        </span>
      </div>

      <div
        className={`flex-1 h-0.5 mb-5 ${step >= 2 ? "bg-ufc" : "bg-gray-200"}`}
      />

      <div className="flex flex-col items-center gap-1">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            step === 2 ? "bg-ufc text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          2
        </div>
        <span
          className={`text-xs font-medium ${step === 2 ? "text-ufc" : "text-gray-400"}`}
        >
          Alertas
        </span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([""]);
  const navigate = useNavigate();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-3 bg-white">
        <div className="w-full max-w-md">
          <div className="flex gap-6 mb-8 border-b border-gray-200">
            <button
              className="pb-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>
            <button className="pb-3 text-sm font-semibold text-ufc border-b-2 border-ufc">
              Criar Conta
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastre-se na plataforma
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Preencha as informações necessárias para ter acesso as
            oportunidades.
          </p>

          <StepIndicator step={step} />

          {step === 1 && (
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="nome"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Curso
                  </label>
                  <div className="relative">
                    <Select>
                      <SelectTrigger className="w-full border border-gray-200 rounded-xl px-4 py-5.5 text-sm  focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-600 placeholder:text-gray-300">
                        <SelectValue placeholder="Selecione seu curso" className="placeholder:text-gray-300" />
                      </SelectTrigger>

                      <SelectContent position="popper" sideOffset={4} className="bg-white">
                        <SelectGroup>
                          <SelectItem value="ciência-da-computação">
                            Ciência da Computação
                          </SelectItem>
                          <SelectItem value="design-digital">
                            Design Digital
                          </SelectItem>
                          <SelectItem value="engenharia-de-software">
                            Engenharia de Software
                          </SelectItem>
                          <SelectItem value="engenharia-da-computacao">
                            Engenharia da Computação
                          </SelectItem>
                          <SelectItem value="inteligencia-artificial">
                            Inteligencia Artificial
                          </SelectItem>
                          <SelectItem value="redes-de-computadores">
                            Redes de Computadores
                          </SelectItem>
                          <SelectItem value="sistemas-de-informacao">
                            Sistemas de Informação
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

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
                  />
                </div>
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
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                onClick={() => setStep(2)}
              >
                Continuar cadastro <span className="text-lg">→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Selecione quais oportunidades você deseja receber alertas
                </p>
                <div className="flex flex-wrap gap-2">
                  {OPPORTUNITY_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          active
                            ? "bg-ufc text-white border-ufc"
                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className="w-full bg-ufc hover:bg-blue-900 text-white font-medium py-4 rounded-xl transition-colors mt-4"
                onClick={() => navigate("/dashboard")}
              >
                Acessar a plataforma
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
