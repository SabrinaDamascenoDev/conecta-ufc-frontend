import type {
  OportunidadeAPI,
  OportunidadesParams,
  PaginationMeta,
} from "../hooks/useOportunidades";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface OportunidadesResponse {
  data: OportunidadeAPI[];
  meta?: PaginationMeta;
}

function buildUrl(
  endpoint: string,
  params: OportunidadesParams = {}
): string {
  const qs = new URLSearchParams();

  if (params.page) qs.set("page", String(params.page));
  if (params.size) qs.set("size", String(params.size));

  if (params.busca?.trim()) qs.set("busca", params.busca.trim());
  if (params.origem?.trim()) qs.set("origem", params.origem.trim());
  if (params.tipo?.trim()) qs.set("tipo", params.tipo.trim());

  if (params.data_inicio)
    qs.set("data_inicio", params.data_inicio);

  if (params.data_fim)
    qs.set("data_fim", params.data_fim);

  if (params.remuneracao_min != null)
    qs.set("remuneracao_min", String(params.remuneracao_min));

  if (params.remuneracao_max != null)
    qs.set("remuneracao_max", String(params.remuneracao_max));

  const str = qs.toString();

  return `${API_BASE}${endpoint}${str ? `?${str}` : ""}`;
}

async function fetchLista(
  endpoint: string,
  params: OportunidadesParams = {}
): Promise<OportunidadesResponse> {
  const url = buildUrl(endpoint, params);

  console.log("URL:", url);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Erro ${res.status}`);
  }

  const json = await res.json();

  return {
    data: Array.isArray(json) ? json : (json.data ?? []),
    meta: json.meta,
  };
}


export function fetchOportunidades(params: OportunidadesParams = {}) {
  return fetchLista("/oportunidades", params);
}


export function fetchOportunidadesAZ(params: OportunidadesParams = {}) {
  return fetchLista("/oportunidades/ordenadas/a-z", params);
}

export function fetchOportunidadesMaisRecentes(
  params: OportunidadesParams = {}
) {
  return fetchLista("/oportunidades/ordenadas/mais-recentes", params);
}