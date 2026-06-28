
import type {
  OportunidadeAPI,
  OportunidadesParams,
  PaginationMeta,
} from "../hooks/useOportunidades";
import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface AlertasResponse {
  data: OportunidadeAPI[];
  meta: PaginationMeta;
}

async function handleError(
  response: Response,
  mensagem: string
): Promise<never> {
  const error = await response.json().catch(() => ({}));
  throw new Error(error.detail ?? mensagem);
}

export async function getAlertas(
  params: OportunidadesParams = {}
): Promise<AlertasResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.size) query.set("size", String(params.size));
  if (params.busca) query.set("busca", params.busca);
  if (params.origem) query.set("origem", params.origem);
  if (params.tipo) query.set("tipo", params.tipo);

  if (params.remuneracao_min != null)
    query.set("remuneracao_min", String(params.remuneracao_min));

  if (params.remuneracao_max != null)
    query.set("remuneracao_max", String(params.remuneracao_max));

  const response = await fetch(
    `${API_BASE}/oportunidades/alertas?${query.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...loginService.getAuthHeader(),
      },
    }
  );

  if (!response.ok)
    return handleError(response, "Erro ao buscar os alertas");

  return response.json();
}