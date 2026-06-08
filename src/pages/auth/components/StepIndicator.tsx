
import { Check } from "lucide-react";

export function StepIndicator({ step }: { step: 1 | 2 }) {
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