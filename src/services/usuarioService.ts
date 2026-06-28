import { loginService } from "./loginServise";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface Usuario {
  sub: string;
  email: string;
  preferred_username: string;
  preferencias: string[];
  nome: string;
  curso: string;
  oportunidades: string[];
}

export interface UsuarioPut {
  email: string;
  nome: string;
  oportunidades:string[];
}
let usuarioCache: Usuario | null = null;
let usuarioCachePromise: Promise<Usuario> | null = null;

const cursosMap: Record<string, string> = {
  "ciencia-da-computacao": "Ciência da Computação",
  "design-digital": "Design Digital",
  "engenharia-de-software": "Engenharia de Software",
  "engenharia-da-computacao": "Engenharia da Computação",
  "inteligencia-artificial": "Inteligência Artificial",
  "redes-de-computadores": "Redes de Computadores",
  "sistemas-de-informacao": "Sistemas de Informação",
};

export function formatarCurso(curso: string) {
  return cursosMap[curso] ?? curso;
}

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
        usuarioCache = {
          ...u,
          curso: formatarCurso(u.curso),
        };
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

export async function putUsuario(): Promise<Usuario> {
  const response = await fetch(`${API_BASE}/usuarios/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...loginService.getAuthHeader(),
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? "Erro ao pegar os dados do usuário");
  }
  return response.json() as Promise<Usuario>;
}
