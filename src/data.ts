export type Category = 'A' | 'B' | 'C' | 'D' | 'E';

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  experience: number;
  rating: number;
  reviewCount: number;
  pricePerLesson: number;
  categories: Category[];
  neighborhood: string;
  city: string;
  verified: boolean;
  bio: string;
  availability: string[];
  totalStudents: number;
  approvalRate: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Lesson {
  id: string;
  instructorId: string;
  instructorName: string;
  date: string;
  time: string;
  category: Category;
  status: 'scheduled' | 'completed' | 'cancelled';
  neighborhood: string;
}

export interface SimuladoQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

// ─── INSTRUTORES ────────────────────────────────────────────────────────────

export const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Paulo Henrique Santos',
    initials: 'PH',
    experience: 7,
    rating: 4.9,
    reviewCount: 127,
    pricePerLesson: 120,
    categories: ['B'],
    neighborhood: 'Água Verde',
    city: 'Curitiba',
    verified: true,
    bio: 'Instrutor com 7 anos de experiência, especializado em alunos de primeira viagem. Agenda automática, política clara de cancelamento e repasse garantido. Aprovação de 97% dos alunos.',
    availability: ['Seg a Sex: 7h – 18h', 'Sábado: 8h – 12h'],
    totalStudents: 312,
    approvalRate: 97,
  },
  {
    id: '2',
    name: 'Renata Azevedo Ferreira',
    initials: 'RA',
    experience: 4,
    rating: 4.8,
    reviewCount: 89,
    pricePerLesson: 100,
    categories: ['A', 'B'],
    neighborhood: 'Batel',
    city: 'Curitiba',
    verified: true,
    bio: 'Instrutora dinâmica com forte presença no Instagram. Especializada em categorias A e B. Pagamento dentro do app, lembretes automáticos e horários flexíveis.',
    availability: ['Seg a Sex: 8h – 20h', 'Sábado: 9h – 15h'],
    totalStudents: 201,
    approvalRate: 95,
  },
  {
    id: '3',
    name: 'Marcos Vieira Lima',
    initials: 'MV',
    experience: 12,
    rating: 5.0,
    reviewCount: 214,
    pricePerLesson: 150,
    categories: ['B', 'C'],
    neighborhood: 'Centro',
    city: 'Curitiba',
    verified: true,
    bio: 'O mais experiente da plataforma com 12 anos de atuação. Próximo aos locais de prova. Recebimento garantido antes da aula e histórico completo do aluno.',
    availability: ['Seg a Sex: 6h – 17h'],
    totalStudents: 489,
    approvalRate: 99,
  },
  {
    id: '4',
    name: 'Eliane Costa Rodrigues',
    initials: 'EC',
    experience: 9,
    rating: 4.7,
    reviewCount: 156,
    pricePerLesson: 110,
    categories: ['B'],
    neighborhood: 'Portão',
    city: 'Curitiba',
    verified: true,
    bio: 'Instrutora com agenda integrada e confirmação obrigatória do aluno. Divide atenção entre alunos próprios e parcerias locais. Metodologia tranquila e detalhada.',
    availability: ['Seg, Qua, Sex: 8h – 18h', 'Ter, Qui: 14h – 20h', 'Sábado: 8h – 13h'],
    totalStudents: 287,
    approvalRate: 94,
  },
  {
    id: '5',
    name: 'Sérgio Almeida Costa',
    initials: 'SA',
    experience: 3,
    rating: 4.6,
    reviewCount: 43,
    pricePerLesson: 90,
    categories: ['B'],
    neighborhood: 'CIC',
    city: 'Curitiba',
    verified: true,
    bio: 'Instrutor jovem e dinâmico, focado em alunos que precisam de flexibilidade de horário. Perfil verificado, avaliações reais e destaque regional para quem quer começar.',
    availability: ['Seg a Sex: 13h – 21h', 'Sábado e Dom: 9h – 18h'],
    totalStudents: 78,
    approvalRate: 92,
  },
];

// ─── HORÁRIOS DISPONÍVEIS ────────────────────────────────────────────────────

export const timeSlots: TimeSlot[] = [
  { id: '1', time: '07:00', available: false },
  { id: '2', time: '08:00', available: true },
  { id: '3', time: '09:00', available: true },
  { id: '4', time: '10:00', available: false },
  { id: '5', time: '11:00', available: true },
  { id: '6', time: '13:00', available: true },
  { id: '7', time: '14:00', available: false },
  { id: '8', time: '15:00', available: true },
  { id: '9', time: '16:00', available: true },
  { id: '10', time: '17:00', available: false },
  { id: '11', time: '18:00', available: true },
  { id: '12', time: '19:00', available: true },
];

// ─── MINHAS AULAS ────────────────────────────────────────────────────────────

export const myLessons: Lesson[] = [
  {
    id: '1',
    instructorId: '1',
    instructorName: 'Paulo Henrique',
    date: '2026-06-20',
    time: '14:30',
    category: 'B',
    status: 'scheduled',
    neighborhood: 'Água Verde',
  },
  {
    id: '2',
    instructorId: '2',
    instructorName: 'Renata Azevedo',
    date: '2026-06-17',
    time: '10:00',
    category: 'B',
    status: 'completed',
    neighborhood: 'Batel',
  },
  {
    id: '3',
    instructorId: '1',
    instructorName: 'Paulo Henrique',
    date: '2026-06-14',
    time: '09:00',
    category: 'B',
    status: 'completed',
    neighborhood: 'Água Verde',
  },
  {
    id: '4',
    instructorId: '3',
    instructorName: 'Marcos Vieira',
    date: '2026-06-10',
    time: '08:00',
    category: 'B',
    status: 'completed',
    neighborhood: 'Centro',
  },
  {
    id: '5',
    instructorId: '4',
    instructorName: 'Eliane Costa',
    date: '2026-06-05',
    time: '16:00',
    category: 'B',
    status: 'cancelled',
    neighborhood: 'Portão',
  },
];

// ─── PROGRESSO DO ALUNO ──────────────────────────────────────────────────────

export const studentProgress = {
  name: 'Vitor Camillo',
  category: 'B' as Category,
  theoryProgress: 86,
  practicalHours: 12,
  requiredPracticalHours: 20,
  lessonsCompleted: 4,
  nextLessonDate: '20/06/2026',
  nextLessonTime: '14:30',
  nextInstructor: 'Paulo Henrique',
  simuladoScore: 32,
  simuladoTotal: 40,
  approvalChance: 78,
};

// ─── QUESTÕES DO SIMULADO ────────────────────────────────────────────────────

export const simuladoQuestions: SimuladoQuestion[] = [
  {
    id: '1',
    question: 'Ao se aproximar de uma faixa de pedestres sem semáforo, o motorista deve:',
    options: [
      'Acelerar para passar antes dos pedestres',
      'Reduzir a velocidade e parar para dar passagem aos pedestres',
      'Buzinar para avisar os pedestres',
      'Manter a velocidade e desviar dos pedestres',
    ],
    correct: 1,
    explanation: 'O CTB art. 70 determina que nas faixas de pedestres o motorista deve parar o veículo para dar passagem.',
  },
  {
    id: '2',
    question: 'O uso do cinto de segurança é obrigatório para:',
    options: [
      'Apenas o motorista',
      'Apenas os passageiros dos bancos traseiros',
      'Todos os ocupantes do veículo',
      'Apenas em rodovias',
    ],
    correct: 2,
    explanation: 'O CTB art. 65 exige o uso de cinto de segurança para todos os ocupantes do veículo em qualquer via.',
  },
  {
    id: '3',
    question: 'Qual é a velocidade máxima permitida em vias urbanas simples?',
    options: ['40 km/h', '50 km/h', '60 km/h', '80 km/h'],
    correct: 2,
    explanation: 'Em vias urbanas simples a velocidade máxima é de 60 km/h conforme o CTB art. 61.',
  },
  {
    id: '4',
    question: 'O condutor que ingerir bebida alcoólica fica proibido de dirigir pois:',
    options: [
      'Reduz apenas o tempo de reação',
      'Diminui a capacidade de coordenação, visão e julgamento',
      'Causa sonolência apenas em grandes quantidades',
      'O efeito é passageiro e não afeta a direção',
    ],
    correct: 1,
    explanation: 'O álcool afeta múltiplas capacidades cognitivas e motoras, tornando a direção extremamente perigosa.',
  },
  {
    id: '5',
    question: 'Em uma via de mão dupla sem divisória, a ultrapassagem deve ser feita:',
    options: [
      'Pelo lado direito',
      'Pelo lado esquerdo',
      'Por qualquer lado desde que haja espaço',
      'Apenas quando o veículo da frente parar',
    ],
    correct: 1,
    explanation: 'A ultrapassagem deve ser feita sempre pelo lado esquerdo, pelo acostamento apenas em casos específicos.',
  },
  {
    id: '6',
    question: 'Ao estacionar o veículo em aclive (subida), o volante deve ser virado:',
    options: [
      'Para a esquerda, em direção à via',
      'Para a direita, em direção ao meio-fio',
      'Reto, sem virar',
      'Para o lado oposto ao meio-fio',
    ],
    correct: 1,
    explanation: 'Em aclive com meio-fio, o volante deve ser virado para a direita para que a roda trave no meio-fio em caso de falha no freio.',
  },
  {
    id: '7',
    question: 'A distância mínima de parada de um veículo depende principalmente de:',
    options: [
      'Apenas da velocidade do veículo',
      'Da velocidade, do estado dos pneus, dos freios e do pavimento',
      'Apenas do peso do veículo',
      'Da habilidade do motorista exclusivamente',
    ],
    correct: 1,
    explanation: 'A distância de parada depende de múltiplos fatores: velocidade, condições mecânicas e do pavimento.',
  },
  {
    id: '8',
    question: 'Placa circular com a borda vermelha indica:',
    options: [
      'Indicação de informação',
      'Proibição',
      'Advertência de perigo',
      'Serviço auxiliar',
    ],
    correct: 1,
    explanation: 'Placas circulares com borda vermelha são de regulamentação e indicam proibições ou obrigações.',
  },
  {
    id: '9',
    question: 'Ao passar por uma lombada ou quebra-mola, o condutor deve:',
    options: [
      'Acelerar para passar mais rápido',
      'Reduzir a velocidade antes da lombada',
      'Frear em cima da lombada',
      'Desviar pela calçada',
    ],
    correct: 1,
    explanation: 'A velocidade deve ser reduzida antes da lombada para preservar o veículo e a segurança dos ocupantes.',
  },
  {
    id: '10',
    question: 'Em cruzamento sem sinalização, tem preferência de passagem:',
    options: [
      'O veículo que vem pela esquerda',
      'O veículo que vem pela direita',
      'O veículo maior',
      'O veículo que chegou primeiro',
    ],
    correct: 1,
    explanation: 'Segundo o CTB art. 29, em cruzamentos sem sinalização, tem preferência o veículo que vem pela direita.',
  },
];
