import { z } from "zod";

export const esqueceuSenhaSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido"),
});

export type EsqueceuSchemaData = z.infer<
  typeof esqueceuSenhaSchema
>;