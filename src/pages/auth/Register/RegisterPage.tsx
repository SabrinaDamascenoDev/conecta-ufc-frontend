import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LeftPanel } from "../components/LeftPanel";
import {
  Select,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../../components/ui/select";
import { NavagateBar } from "../components/NavegateBar";
import { useForm, Controller } from "react-hook-form";
import { type RegisterSchemaData, registerSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepIndicator } from "../components/StepIndicator";
import { registerUser } from "@/services/authService";
import { toast } from "sonner";

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

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterSchemaData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterSchemaData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      curso: "",
      senha: "",
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  function onSubmit(data: RegisterSchemaData) {
    setFormData(data);
    console.log(data);
    setStep(2);
  }
  async function finalizarCadastro() {
    if (!formData) return;

    try {
      await registerUser({
        ...formData,
        oportunidades: selectedTags,
      });

      toast.success("Cadastro realizado com sucesso!");

      navigate("/vagas");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao realizar cadastro",
      );
    }
  }

  return (
    <div className="flex min-h-screen">
      <LeftPanel />

      <div className="flex-1 flex items-center justify-center p-3 bg-white">
        <div className="w-full max-w-md">
          <NavagateBar />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastre-se na plataforma
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Preencha as informações necessárias para ter acesso as
            oportunidades.
          </p>

          <StepIndicator step={step} />

          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="nome"
                    {...register("nome")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1.5">
                    Curso
                  </label>
                  <Controller
                    name="curso"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border border-gray-200 rounded-xl px-4 py-5.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-600">
                          <SelectValue
                            placeholder="Selecione seu curso"
                            className="placeholder:text-gray-300"
                          />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          className="bg-white"
                        >
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
                    )}
                  />
                  {errors.curso && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.curso.message}
                    </p>
                  )}
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
                    {...register("email")}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                  />
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  Senha
                </label>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Lock size={16} className="text-gray-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••••••"
                    {...register("senha")}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.senha.message}
                </p>
              )}

              <button
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                type="submit"
              >
                Continuar cadastro <span className="text-lg">→</span>
              </button>
            </form>
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
                className="w-full bg-ufc text-white font-medium py-4 rounded-xl transition-colors mt-4"
                onClick={finalizarCadastro}
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
