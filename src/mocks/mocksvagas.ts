export type Programa =
  | "PAID"
  | "PID"
  | "PIBIC"
  | "P&D"
  | "PET"
  | "PET-SI"
  | "PPCA"
  | "Extenção";

export interface Vaga {
  id: number;
  titulo: string;
  programa: Programa;
  publicadoHa: string;
  ate: string;
  descricao: string;
  coordenador: string;
  valor: string;
  tags: string[];
  encerraEm: number; // dias
  salvo: boolean;
}

export const vagas: Vaga[] = [
  {
    id: 1,
    titulo: "PID - Iniciação à docência",
    programa: "PID",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao: "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: "700 R$",
    tags: ["PID", "Todos os cursos"],
    encerraEm: 4,
    salvo: false,
  },
  {
    id: 2,
    titulo: "PIBIC - Iniciação Científica",
    programa: "PIBIC",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao: "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: "700 R$",
    tags: ["PIBIC", "Todos os cursos"],
    encerraEm: 7,
    salvo: true,
  },
  {
    id: 3,
    titulo: "PET - Programa de Educação Tutorial",
    programa: "PET",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao: "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: "700 R$",
    tags: ["PIBIC", "CC", "DD", "IA", "EC", "ES", "RC"],
    encerraEm: 12,
    salvo: false,
  },
  {
    id: 4,
    titulo: "PAID - Apoio ao Discente",
    programa: "PAID",
    publicadoHa: "5 dias",
    ate: "20/05/2026",
    descricao: "Seleção de bolsista para auxílio em laboratórios de informática.",
    coordenador: "Carla Mendes",
    valor: "500 R$",
    tags: ["PAID", "SI", "CC"],
    encerraEm: 15,
    salvo: false,
  },
  {
    id: 5,
    titulo: "P&D - Pesquisa e Desenvolvimento",
    programa: "P&D",
    publicadoHa: "1 dia",
    ate: "30/05/2026",
    descricao: "Desenvolvimento de projeto em redes de computadores e IoT.",
    coordenador: "Marcos Lima",
    valor: "900 R$",
    tags: ["P&D", "EC", "CC"],
    encerraEm: 20,
    salvo: false,
  },
];