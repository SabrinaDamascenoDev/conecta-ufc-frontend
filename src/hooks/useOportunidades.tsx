import { useState, useEffect, useCallback, useRef } from "react";

export type Programa = "PAIP" | "PID" | "PIBIC" | "P&D" | "PET" | "PET-SI" | "PPCA" | "Extensão";

export interface ResultadoAPI {
  id: number;
  titulo: string;
  link: string;
  data_publicacao: string;
}

export interface OportunidadeAPI {
  id: number;
  titulo: string;
  origem: string;
  tipo: string;
  link: string;
  data_inicio: string;
  data_fim: string;
  remuneracao: number | string;
  vagas: number;
  data_criacao: string;
  resultados: ResultadoAPI[];
}

export interface PaginationMeta {
  total_elements: number;
  total_pages: number;
  current_page: number;
  size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface VagaMapeada {
  id: number;
  titulo: string;
  programa: Programa;
  origem: string;
  link: string;
  publicadoHa: string;
  ate: string;
  encerraEm: number;
  dataCriacao: Date;
  remuneracao: string;
  vagasRemuneradas: number;
  vagasVoluntarias: number;
  coordenador: string;
  descricao: string;
  tags: string[];
  salvo: boolean;
  temResultados: boolean;
  resultados: ResultadoAPI[];
}

export interface OportunidadesParams {
  page?: number;
  size?: number;
  busca?: string;
  origem?: string;
  tipo?: string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function diasRestantes(dataFim: string): number {
  const fim = new Date(dataFim);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  fim.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((fim.getTime() - hoje.getTime()) / 86_400_000), 0);
}

function diasPassados(dataCriacao: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dataCriacao).getTime()) / 86_400_000
  );
  if (diff === 0) return "hoje";
  if (diff === 1) return "1 dia";
  return `${diff} dias`;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatarValor(remuneracao: number | string): string {
  const n = typeof remuneracao === "string" ? parseFloat(remuneracao) : remuneracao;
  if (!n || isNaN(n)) return "Consulte o edital";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizarTipo(tipo: string): string {
  return tipo.toUpperCase().trim().replace(/\s+/g, " ");
}

function normalizarPrograma(tipo: string): Programa | null {
  const t = normalizarTipo(tipo);

  // Extensão — captura qualquer variação de grafia
  if (t.includes("EXTEN")) return "Extensão";

  const map: Record<string, Programa> = {
    PAIP:                "PAIP",
    PID:                 "PID",
    PIBIC:               "PIBIC",
    PIBIT:               "PIBIC",
    "P&D":               "P&D",
    PD:                  "P&D",
    "PROCESSO SELETIVO": "P&D",
    PROCESSOSELETIVO:    "P&D",
    PET:                 "PET",
    "PET-SI":            "PET-SI",
    PPCA:                "PPCA",
  };

  // Match exato primeiro, depois por prefixo (ex: "PAIP 2026" → "PAIP")
  if (map[t]) return map[t];
  const chave = Object.keys(map).find((k) => t.startsWith(k));
  if (chave) return map[chave];

  console.warn(`[useOportunidades] Tipo desconhecido: "${tipo}" — vaga ignorada`);
  return null;
}

function tagsDoTipo(tipo: string): string[] {
  const t = normalizarTipo(tipo);
  if (t.includes("EXTEN")) return ["Extensão", "Graduação"];

  const map: Record<string, string[]> = {
    PID:                 ["Iniciação à Docência", "Graduação"],
    PIBIC:               ["Iniciação Científica", "Pesquisa"],
    PIBIT:               ["Inovação Tecnológica", "Pesquisa"],
    "P&D":               ["Pesquisa", "Desenvolvimento"],
    "PROCESSO SELETIVO": ["Pesquisa", "Desenvolvimento"],
    PROCESSOSELETIVO:    ["Pesquisa", "Desenvolvimento"],
    PET:                 ["Grupo Tutorial", "Graduação"],
    PAIP:                ["Apoio Discente", "Graduação"],
    PPCA:                ["Pós-graduação", "Pesquisa"],
  };

  const chave = Object.keys(map).find((k) => t.startsWith(k));
  return chave ? map[chave] : [tipo];
}

function mapearOportunidade(o: OportunidadeAPI): VagaMapeada | null {
  const programa = normalizarPrograma(o.tipo);
  if (!programa) return null;

  const remuneracaoNum =
    typeof o.remuneracao === "string" ? parseFloat(o.remuneracao) : o.remuneracao;

  return {
    id: o.id,
    titulo: o.titulo,
    programa,
    origem: o.origem,
    link: o.link,
    publicadoHa: diasPassados(o.data_criacao),
    ate: formatarData(o.data_fim),
    encerraEm: diasRestantes(o.data_fim),
    dataCriacao: new Date(o.data_criacao),
    remuneracao: formatarValor(o.remuneracao),
    vagasRemuneradas: remuneracaoNum > 0 ? o.vagas : 0,
    vagasVoluntarias: remuneracaoNum === 0 ? o.vagas : 0,
    coordenador: "Consulte o edital",
    descricao: "Consulte o edital para mais informações sobre esta oportunidade.",
    tags: tagsDoTipo(o.tipo),
    salvo: false,
    temResultados: o.resultados.length > 0,
    resultados: o.resultados,
  };
}

// ─── programa → string que o backend aceita no campo `tipo` ─────────────────
export const PROGRAMA_PARA_TIPO: Partial<Record<Programa, string>> = {
  PAIP:     "PAIP",
  PID:      "PID",
  PIBIC:    "PIBIC",
  "P&D":    "P&D",
  PET:      "PET",
  "PET-SI": "PET-SI",
  PPCA:     "PPCA",
  Extensão: "Extensão",
};

// ─── API ─────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function buildUrl(params: OportunidadesParams): string {
  const qs = new URLSearchParams();
  if (params.page)           qs.set("page",   String(params.page));
  if (params.size)           qs.set("size",   String(params.size));
  if (params.busca?.trim())  qs.set("busca",  params.busca.trim());
  if (params.origem?.trim()) qs.set("origem", params.origem.trim());
  if (params.tipo?.trim())   qs.set("tipo",   params.tipo.trim());
  const str = qs.toString();
  return `${API_BASE}/oportunidades${str ? `?${str}` : ""}`;
}

// ─── hook ────────────────────────────────────────────────────────────────────

export interface UseOportunidadesReturn {
  vagas: VagaMapeada[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  setVagas: React.Dispatch<React.SetStateAction<VagaMapeada[]>>;
  toggleSalvo: (id: number) => void;
  goToPage: (page: number) => void;
  setParams: (partial: Partial<Omit<OportunidadesParams, "page">>) => void;
}

const DEFAULT_META: PaginationMeta = {
  total_elements: 0,
  total_pages: 1,
  current_page: 1,
  size: 20,
  has_next: false,
  has_previous: false,
};

export function useOportunidades(): UseOportunidadesReturn {
  // params guardado em ref para não causar re-fetch ao ser passado como dep
  const [params, setParamsState] = useState<OportunidadesParams>({
    page: 1,
    size: 20,
  });

  const [vagas, setVagas] = useState<VagaMapeada[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchOportunidades() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(buildUrl(params), {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail ?? `Erro ${res.status}`);
        }

        const json = await res.json();

        const raw: OportunidadeAPI[] = Array.isArray(json) ? json : (json.data ?? []);
        const metaApi: PaginationMeta | undefined = json.meta;

        if (!cancelled) {
          const mapeadas = raw
            .map(mapearOportunidade)
            .filter((v): v is VagaMapeada => v !== null);

          setVagas(mapeadas);
          if (metaApi) {
            setMeta(metaApi);
          } else {
            setMeta({
              ...DEFAULT_META,
              total_elements: mapeadas.length,
              current_page: params.page ?? 1,
              size: params.size ?? 20,
            });
          }
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao carregar oportunidades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOportunidades();
    return () => { cancelled = true; };
  }, [params]);

  const goToPage = useCallback((page: number) => {
    setParamsState((prev) => ({ ...prev, page }));
  }, []);

  const setParams = useCallback(
    (partial: Partial<Omit<OportunidadesParams, "page">>) => {
      setParamsState((prev) => {
        const next = { ...prev, ...partial, page: 1 };
        if (
          next.busca === prev.busca &&
          next.tipo === prev.tipo &&
          next.origem === prev.origem
        ) return prev;
        return next;
      });
    },
    []
  );

  function toggleSalvo(id: number) {
    setVagas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, salvo: !v.salvo } : v))
    );
  }

  return { vagas, setVagas, toggleSalvo, loading, error, meta, goToPage, setParams };
}