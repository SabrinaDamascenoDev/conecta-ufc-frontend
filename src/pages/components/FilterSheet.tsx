import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Programa } from "@/mocks/mocksvagas";

const PROGRAMAS: Programa[] = ["PAID", "PID", "PIBIC", "P&D", "PET", "PET-SI", "PPCA", "Extenção"];
const TAGS_COMUNS = ["CC", "SI", "EC", "ES", "RC", "IA", "DD", "Todos os cursos"];
const FAIXAS_VALOR = ["Até R$ 500", "R$ 501–R$ 700", "R$ 701–R$ 900", "Acima de R$ 900"];
const PRAZO = ["Encerra em até 7 dias", "Encerra em até 15 dias", "Encerra em até 30 dias"];

export type AdvancedFilters = {
  programas: Programa[];
  tags: string[];
  valor: string[];
  prazo: string[];
};

const EMPTY: AdvancedFilters = { programas: [], tags: [], valor: [], prazo: [] };

interface FilterSheetProps {
  onApply: (filters: AdvancedFilters) => void;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function countActive(f: AdvancedFilters) {
  return f.programas.length + f.tags.length + f.valor.length + f.prazo.length;
}

export function FilterSheet({ onApply }: FilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<AdvancedFilters>(EMPTY);
  const [draft, setDraft] = useState<AdvancedFilters>(EMPTY);

  const activeCount = countActive(applied);

  function handleOpen() {
    setDraft(applied);
    setOpen(true);
  }

  function handleApply() {
    setApplied(draft);
    onApply(draft);
    setOpen(false);
  }

  function handleClear() {
    setDraft(EMPTY);
  }

  function set<K extends keyof AdvancedFilters>(key: K, val: AdvancedFilters[K][number]) {
    setDraft((prev) => ({ ...prev, [key]: toggle(prev[key] as string[], val as string) }));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpen}
          className="relative h-11 w-11 rounded-xl border-gray-300 bg-white shadow-sm hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-[#1a4fa0] text-[10px] font-bold text-white flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm flex flex-col gap-0 p-0 bg-white">
        <SheetHeader className="px-5 pt-5 pb-4 flex flex-row items-center justify-between">
          <SheetTitle className="text-base font-semibold text-gray-900">Filtros</SheetTitle>
          {countActive(draft) > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-[#1a4fa0] hover:underline font-medium"
            >
              Limpar tudo
            </button>
          )}
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
          <FilterGroup
            title="Programa"
            options={PROGRAMAS}
            selected={draft.programas}
            onToggle={(v) => set("programas", v as Programa)}
          />

          <Separator />

          <FilterGroup
            title="Área / Curso"
            options={TAGS_COMUNS}
            selected={draft.tags}
            onToggle={(v) => set("tags", v)}
          />

          <Separator />

          <FilterGroup
            title="Valor da bolsa"
            options={FAIXAS_VALOR}
            selected={draft.valor}
            onToggle={(v) => set("valor", v)}
          />

          <Separator />

          <FilterGroup
            title="Prazo de inscrição"
            options={PRAZO}
            selected={draft.prazo}
            onToggle={(v) => set("prazo", v)}
          />
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 rounded-xl bg-[#1a4fa0] hover:bg-[#163d7c] text-white"
            onClick={handleApply}
          >
            Aplicar
            {countActive(draft) > 0 && (
              <Badge className="ml-1.5 bg-white/20 text-white text-[10px] px-1.5 py-0 h-4">
                {countActive(draft)}
              </Badge>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface FilterGroupProps {
  title: string;
  options: readonly string[];
  selected: string[];
  onToggle: (val: string) => void;
}

function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const id = `filter-${title}-${opt}`;
          return (
            <div key={opt} className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={selected.includes(opt)}
                onCheckedChange={() => onToggle(opt)}
                className="border-gray-300 data-[state=checked]:bg-[#1a4fa0] data-[state=checked]:border-[#1a4fa0]"
              />
              <Label
                htmlFor={id}
                className="text-sm text-gray-700 font-normal cursor-pointer select-none"
              >
                {opt}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}