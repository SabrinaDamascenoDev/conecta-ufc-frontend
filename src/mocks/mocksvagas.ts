export type Programa =
  | "PAIP"
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
  encerraEm: number;
  salvo: boolean;
  vagasVoluntarias: number;
  vagasRemuneradas: number;
  requisitos: string[];
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
    vagasVoluntarias: 2,
    vagasRemuneradas: 1,
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício e nem ser bolsista de qualquer outro programa de ensino, pesquisa e/ou extensão quando da efetivação da bolsa. Alunos bolsistas deverão entregar uma carta de comprometimento de desligamento do respectivo programa;",
      "Requisito possuir aprovação na disciplina Cálculo II;",
      "Ter uma carga horária disponível de 12 (doze) horas semanais para o desenvolvimento das atividades inerentes ao programa de monitoria;",
    ],
  },
  {
    id: 2,
    titulo: "PIBIC - Iniciação Científica",
    programa: "PIBIC",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao: "Seleção de bolsista para pesquisa em computação e tecnologia.",
    coordenador: "André Braga",
    valor: "700 R$",
    tags: ["PIBIC", "Todos os cursos"],
    encerraEm: 7,
    salvo: false,
    vagasVoluntarias: 1,
    vagasRemuneradas: 1,
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício e nem ser bolsista de qualquer outro programa de pesquisa quando da efetivação da bolsa;",
      "Ter coeficiente de rendimento acadêmico (CRA) mínimo de 7,0;",
      "Disponibilidade de 20 horas semanais para as atividades de pesquisa;",
    ],
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
    vagasVoluntarias: 3,
    vagasRemuneradas: 2,
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício com outras bolsas de ensino, pesquisa ou extensão;",
      "Participar das reuniões semanais do grupo PET;",
      "Disponibilidade de 20 horas semanais para as atividades do programa;",
    ],
  },
  {
    id: 4,
    titulo: "PAIP - Apoio ao Discente",
    programa: "PAIP",
    publicadoHa: "5 dias",
    ate: "20/05/2026",
    descricao: "Seleção de bolsista para auxílio em laboratórios de informática.",
    coordenador: "Carla Mendes",
    valor: "500 R$",
    tags: ["PAIP", "SI", "CC"],
    encerraEm: 15,
    salvo: false,
    vagasVoluntarias: 2,
    vagasRemuneradas: 1,
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir outra bolsa ativa de qualquer natureza;",
      "Disponibilidade de 12 horas semanais para atendimento nos laboratórios;",
      "Ter cursado pelo menos 2 semestres do curso;",
    ],
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
    vagasVoluntarias: 1,
    vagasRemuneradas: 2,
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Conhecimento básico em redes de computadores e protocolos de comunicação;",
      "Não possuir vínculo empregatício externo durante a vigência do projeto;",
      "Disponibilidade de 20 horas semanais para as atividades do projeto;",
    ],
  },
];