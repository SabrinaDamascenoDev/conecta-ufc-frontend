import {z} from 'zod'

export const registerSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().min(1, "Email obrigatório").email("Email inválido"),
    curso: z.string().min(1, "O curso é obrigatório"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type RegisterSchemaData = z.infer<typeof registerSchema>