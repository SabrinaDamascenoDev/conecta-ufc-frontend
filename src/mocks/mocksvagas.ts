export type Curso =
  | "CC"
  | "DD"
  | "ES"
  | "EC"
  | "IA"
  | "RC"
  | "SI";

export type TagTipo =
  | "PAID"
  | "PID"
  | "PIBIC"
  | "P&D"
  | "PET"
  | "PET-SI"
  | "PPCA"
  | "Extenção";

export interface Vaga {
  id: string;
  titulo: string;
  tipo: TagTipo;
  publicadoHa: string;
  ate: string;
  descricao: string;
  coordenador: string;
  valor: number;
  vagasVoluntarias: number;
  vagasRemuneradas: number;
  encerraEm: number; // dias
  salvo: boolean;
  cursos: Curso[] | "todos";
  requisitos: string[];
  icone: "graduation" | "atom" | "laptop" | "flask" | "network" | "star";
}

export const VAGAS_MOCK: Vaga[] = [
  {
    id: "1",
    titulo: "PID - Inciação à docência",
    tipo: "PID",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao:
      "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: 700,
    vagasVoluntarias: 2,
    vagasRemuneradas: 1,
    encerraEm: 4,
    salvo: false,
    cursos: "todos",
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício e nem ser bolsista de qualquer outro programa de ensino, pesquisa e/ou extensão quando da efetivação da bolsa. Alunos bolsistas deverão entregar uma carta de comprometimento de desligamento do respectivo programa;",
      'Requisito possuir aprovação na disciplina "Cálculo II";',
      "Ter uma carga horária disponível de 12 (doze) horas semanais para o desenvolvimento das atividades inerentes ao programa de monitoria;",
    ],
    icone: "graduation",
  },
  {
    id: "2",
    titulo: "PIBIC - Iniciação Científica",
    tipo: "PIBIC",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao:
      "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: 700,
    vagasVoluntarias: 1,
    vagasRemuneradas: 2,
    encerraEm: 7,
    salvo: true,
    cursos: "todos",
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício e nem ser bolsista de qualquer outro programa de pesquisa;",
      "Ter coeficiente de rendimento acadêmico (CRA) igual ou superior a 7,0;",
      "Disponibilidade de 20 horas semanais para o desenvolvimento das atividades de pesquisa;",
    ],
    icone: "atom",
  },
  {
    id: "3",
    titulo: "PET - Programa de Educação Tutorial",
    tipo: "PET",
    publicadoHa: "3 dias",
    ate: "15/05/2026",
    descricao:
      "Seleção de bolsista para as disciplinas de Cálculo e Pré-Cálculo.",
    coordenador: "André Braga",
    valor: 700,
    vagasVoluntarias: 0,
    vagasRemuneradas: 3,
    encerraEm: 12,
    salvo: false,
    cursos: ["CC", "DD", "IA", "EC", "ES", "RC"],
    requisitos: [
      "Estar regularmente matriculado em um dos cursos do Campus da UFC em Quixadá;",
      "Não possuir vínculo empregatício nem bolsa de outro programa federal;",
      "Apresentar histórico escolar com aproveitamento mínimo de 75% nas disciplinas cursadas;",
      "Disponibilidade de 20 horas semanais para as atividades do grupo PET;",
    ],
    icone: "laptop",
  },
  {
    id: "4",
    titulo: "PAID - Programa de Apoio ao Discente",
    tipo: "PAID",
    publicadoHa: "5 dias",
    ate: "20/05/2026",
    descricao: "Auxílio estudantil para alunos em situação de vulnerabilidade socioeconômica.",
    coordenador: "Maria Silva",
    valor: 500,
    vagasVoluntarias: 0,
    vagasRemuneradas: 10,
    encerraEm: 18,
    salvo: false,
    cursos: "todos",
    requisitos: [
      "Estar regularmente matriculado na UFC;",
      "Comprovação de situação de vulnerabilidade socioeconômica;",
      "Não ser beneficiário de outro programa de assistência estudantil federal;",
      "Ter no mínimo 50% das disciplinas cursadas aprovadas;",
    ],
    icone: "star",
  },
  {
    id: "5",
    titulo: "P&D - Pesquisa e Desenvolvimento",
    tipo: "P&D",
    publicadoHa: "1 dia",
    ate: "30/06/2026",
    descricao: "Projeto de P&D em parceria com empresa de tecnologia para desenvolvimento de soluções em IA.",
    coordenador: "Carlos Mendes",
    valor: 1200,
    vagasVoluntarias: 1,
    vagasRemuneradas: 2,
    encerraEm: 30,
    salvo: false,
    cursos: ["CC", "EC", "IA", "ES"],
    requisitos: [
      "Estar matriculado a partir do 5º semestre;",
      "Ter conhecimento em Python e Machine Learning;",
      "Disponibilidade de 30 horas semanais;",
      "Não possuir vínculo empregatício formal;",
    ],
    icone: "flask",
  },
  {
    id: "6",
    titulo: "PPCA - Programa de Pós-Graduação",
    tipo: "PPCA",
    publicadoHa: "2 dias",
    ate: "10/06/2026",
    descricao: "Seleção de alunos especiais para disciplinas de pós-graduação em Ciência da Computação.",
    coordenador: "Fernanda Costa",
    valor: 0,
    vagasVoluntarias: 5,
    vagasRemuneradas: 0,
    encerraEm: 3,
    salvo: false,
    cursos: ["CC", "EC"],
    requisitos: [
      "Estar cursando o último ano da graduação;",
      "CRA mínimo de 8,0;",
      "Carta de recomendação de um professor do curso;",
      "Entrevista com o colegiado do PPCA;",
    ],
    icone: "network",
  },
];

export const FILTROS: (TagTipo | "Todas")[] = [
  "Todas",
  "PAID",
  "PID",
  "PIBIC",
  "P&D",
  "PET",
  "PET-SI",
  "PPCA",
  "Extenção",
];