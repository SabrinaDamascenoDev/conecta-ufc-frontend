
export async function registerUser(data: {
  nome: string;
  email: string;
  curso: string;
  senha: string;
  oportunidades: string[];
}) {
  const response = await fetch(
    "http://localhost:8000/usuarios",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Erro ao cadastrar");
  }

  return response.json();
}