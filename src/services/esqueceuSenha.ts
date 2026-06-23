
export async function esqueceuSenhaService(data: {
  email: string;
}) {
  const response = await fetch(
    "http://localhost:8000/usuarios/esqueci-senha",
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
    throw new Error(error.detail || "Erro ao enviar o email");
  }

  return response.json();
}