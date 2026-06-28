// src/hooks/useOportunidades.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchOportunidades } from "@/services/vagasService";
import { useFavoritos } from "@/context/FavoritosContext";

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
  remuneracao_min?: number;
  remuneracao_max?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Mapeamento ───────────────────────────────────────────────────────────────

function normalizarTipo(tipo: string): string {
  return tipo.toUpperCase().trim().replace(/\s+/g, " ");
}

function normalizarPrograma(tipo: string): Programa | null {
  const t = normalizarTipo(tipo);
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

export function mapearOportunidade(o: OportunidadeAPI): VagaMapeada | null {
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseOportunidadesReturn {
  vagas: VagaMapeada[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  setVagas: React.Dispatch<React.SetStateAction<VagaMapeada[]>>;
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
  const { favoritosIds } = useFavoritos();

  const [params, setParamsState] = useState<OportunidadesParams>({
    page: 1,
    size: 20,
  });

  const [vagas, setVagas] = useState<VagaMapeada[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref sempre atualizado — permite que o fetch leia os ids sem ser dependência
  const favoritosIdsRef = useRef(favoritosIds);
  useEffect(() => {
    favoritosIdsRef.current = favoritosIds;
  }, [favoritosIds]);

  // ─── Effect 1: fetch — NÃO depende de favoritosIds ───────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data: raw, meta: metaApi } = await fetchOportunidades(params);

        if (!cancelled) {
          const mapeadas = raw
            .map(mapearOportunidade)
            .filter((v): v is VagaMapeada => v !== null)
            .map((v) => ({ ...v, salvo: favoritosIdsRef.current.has(v.id) }));

          setVagas(mapeadas);
          setMeta(
            metaApi ?? {
              ...DEFAULT_META,
              total_elements: mapeadas.length,
              current_page: params.page ?? 1,
              size: params.size ?? 20,
            }
          );
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Erro ao carregar oportunidades");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params]); // ← apenas params, sem favoritosIds

  // ─── Effect 2: sincroniza campo `salvo` sem re-fetchar ───────────────────
  useEffect(() => {
    setVagas((prev) =>
      prev.map((v) => ({ ...v, salvo: favoritosIds.has(v.id) }))
    );
  }, [favoritosIds]);

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
          next.origem === prev.origem &&
          next.remuneracao_min === prev.remuneracao_min &&
          next.remuneracao_max === prev.remuneracao_max
        ) return prev;
        return next;
      });
    },
    []
  );

  return { vagas, setVagas, loading, error, meta, goToPage, setParams };
}