import type { OportunidadeAPI, OportunidadesParams, PaginationMeta } from "../hooks/useOportunidades";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface OportunidadesResponse {
  data: OportunidadeAPI[];
  meta?: PaginationMeta;
}

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

export async function fetchOportunidades(
  params: OportunidadesParams
): Promise<OportunidadesResponse> {
  const res = await fetch(buildUrl(params), {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Erro ${res.status}`);
  }

  const json = await res.json();

  const data: OportunidadeAPI[] = Array.isArray(json) ? json : (json.data ?? []);
  const meta: PaginationMeta | undefined = json.meta;

  return { data, meta };
}