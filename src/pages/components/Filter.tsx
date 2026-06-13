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
              ? "bg-[#00488C] text-white border-[#00488C]"
              : "bg-white text-gray-600 border-gray-300 hover:border-[#00488C] hover:text-[#00488C]"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}