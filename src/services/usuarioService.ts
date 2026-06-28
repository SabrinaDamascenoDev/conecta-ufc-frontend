import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface Usuario {
  sub: string;
  email: string;
  preferred_username: string;
}

let usuarioCache: Usuario | null = null;
let usuarioCachePromise: Promise<Usuario> | null = null;

export async function getUsuario(): Promise<Usuario> {
  if (usuarioCache) return usuarioCache;

  if (!usuarioCachePromise) {
    usuarioCachePromise = fetch(`${API_BASE}/usuarios/me`, {
      headers: {
        "Content-Type": "application/json",
        ...loginService.getAuthHeader(),
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.detail ?? "Erro ao pegar os dados do usuário");
        }
        return response.json() as Promise<Usuario>;
      })
      .then((u) => {
        usuarioCache = u;
        return u;
      })
      .catch((err) => {
        usuarioCachePromise = null; 
        throw err;
      });
  }

  return usuarioCachePromise;
}

export function clearUsuarioCache() {
  usuarioCache = null;
  usuarioCachePromise = null;
}