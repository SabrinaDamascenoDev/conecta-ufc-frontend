

const API_BASE_URL = "http://localhost:8000";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export const loginService = {
  async loginUsuario(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail ?? "Email ou senha incorretos. Tente novamente.");
    }

    return response.json();
  },

  salvarTokens(data: LoginResponse): void {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("token_type", data.token_type);
  },

  getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
  },

  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },
};