import type { OportunidadeAPI } from "../hooks/useOportunidades";
import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface FavoritarParams {
  oportunidade_id: number;
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

export async function getFavoritos(): Promise<OportunidadeAPI[]> {
  const response = await fetch(`${API_BASE}/oportunidades/favoritos`, {
    headers: { "Content-Type": "application/json", ...loginService.getAuthHeader() },
  });

  if (!response.ok) return handleError(response, "Erro ao buscar os favoritos");

  return response.json();
}