import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterSheet, type AdvancedFilters } from "./FilterSheet";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onApplyFilters: (filters: AdvancedFilters) => void;
}

export function SearchBar({ value, onChange, onApplyFilters }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pesquisar bolsas, vagas..."
          className="pl-10 h-11 bg-white border-gray-300 rounded-xl shadow-sm text-sm focus-visible:ring-[#1a4fa0] outline-none"
        />
      </div>

      <FilterSheet onApply={onApplyFilters} />
    </div>
  );
}