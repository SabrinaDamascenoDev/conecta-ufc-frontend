import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
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
          className="pl-10 h-11 bg-white border-border border-gray-300 rounded-xl shadow-sm text-sm focus-visible:ring-[#1a4fa0] outline-none"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onFilterClick}
        className="h-11 w-11 rounded-xl border-border border-gray-300 bg-white shadow-sm hover:bg-gray-50"
      >
        <SlidersHorizontal size={16} className="text-muted-foreground" />
      </Button>
    </div>
  );
}