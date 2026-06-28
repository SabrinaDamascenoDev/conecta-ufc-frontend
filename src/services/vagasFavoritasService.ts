// src/services/vagasFavoritasService.ts
import type { OportunidadeAPI, OportunidadesParams, PaginationMeta } from "../hooks/useOportunidades";
import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface FavoritarParams {
  oportunidade_id: number;
}

export interface FavoritosResponse {
  data: OportunidadeAPI[];
  meta: PaginationMeta;
}

async function handleError(response: Response, mensagem: string): Promise<never> {
  const error = await response.json().catch(() => ({}));
  throw new Error(error.detail ?? mensagem);
}

export async function favoritarVaga({ oportunidade_id }: FavoritarParams): Promise<string> {
  const response = await fetch(`${API_BASE}/oportunidades/${oportunidade_id}/favoritar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...loginService.getAuthHeader() },
  });
  if (!response.ok) return handleError(response, "Erro ao favoritar a vaga");
  return response.json();
}

export async function desfavoritarVaga({ oportunidade_id }: FavoritarParams): Promise<void> {
  const response = await fetch(`${API_BASE}/oportunidades/${oportunidade_id}/favoritar`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...loginService.getAuthHeader() },
  });
  if (!response.ok) return handleError(response, "Erro ao remover o favorito");
}

export async function getFavoritos(params: OportunidadesParams = {}): Promise<FavoritosResponse> {
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

  const response = await fetch(`${API_BASE}/oportunidades/favoritos?${query.toString()}`, {
    headers: { "Content-Type": "application/json", ...loginService.getAuthHeader() },
  });

  if (!response.ok) return handleError(response, "Erro ao buscar os favoritos");

  return response.json(); 
}