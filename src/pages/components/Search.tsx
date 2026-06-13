import { Search } from "lucide-react";
import { FilterSheet, type AdvancedFilters } from "./FilterSheet";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
}

export function SearchBar({ value, onChange, onApplyFilters }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 w-full max-w-2xl">
      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 flex-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <Search size={16} className="text-gray-400 shrink-0" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar bolsas, vagas..."
          className="flex-1 outline-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
        />
      </div>

      <FilterSheet onApply={onApplyFilters} />
    </div>
  );
}
