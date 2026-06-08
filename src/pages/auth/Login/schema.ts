import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email obrigatório")
    .email("Email inválido"),

  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginSchemaData = z.infer<typeof loginSchema>;