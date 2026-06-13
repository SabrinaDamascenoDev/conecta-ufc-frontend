import { useState } from "react";
import { ArrowUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortOption = {
  label: string;
  value: string;
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Mais recentes", value: "recentes" },
  { label: "Mais antigas", value: "antigas" },
  { label: "A–Z", value: "az" },
  { label: "Z–A", value: "za" },
];

interface SortDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function SortDropdown({ value = "recentes", onChange }: SortDropdownProps) {
  const [selected, setSelected] = useState(value);

  const current = SORT_OPTIONS.find((o) => o.value === selected);

  function handleSelect(opt: SortOption) {
    setSelected(opt.value);
    onChange?.(opt.value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs text-gray-600 border-gray-200 py-4 px-3 bg-white rounded-xl hover:bg-gray-50"
        >
          <ArrowUpDown size={13} />
          {current?.label ?? "Ordenar"}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-md bg-white p-1">
        {SORT_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => handleSelect(opt)}
            className="flex items-center justify-between gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
          >
            {opt.label}
            {selected === opt.value && (
              <Check size={13} className="text-[#1a4fa0]" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}