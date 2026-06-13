import { cn } from "@/lib/utils";
import { type Programa } from "@/mocks/mocksvagas";

type FilterOption = "Todas" | Programa;

const OPTIONS: FilterOption[] = [
  "Todas",
  "PAID",
  "PID",
  "PIBIC",
  "P&D",
  "PET",
  "PET-SI",
  "PPCA",
  "Extenção",
];

interface ProgramaFilterProps {
  selected: FilterOption;
  onChange: (value: FilterOption) => void;
}

export function ProgramaFilter({ selected, onChange }: ProgramaFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
            selected === opt
              ? "bg-[#1a4fa0] text-white border-[#1a4fa0]"
              : "bg-white text-gray-600 border-gray-300 hover:border-[#1a4fa0] hover:text-[#1a4fa0]"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}