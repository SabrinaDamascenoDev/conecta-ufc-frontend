import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export interface Usuario { 
  sub: string,
  email: string,
  preferred_username: string
}


export async function getUsuario(): Promise<Usuario> {
    const response = await fetch(`${API_BASE}/usuarios/me`, {
        headers: {"Content-Type": "application/json", ...loginService.getAuthHeader() },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail ?? "Erro ao pegar os dados do usuário")
    }

    return response.json()
}