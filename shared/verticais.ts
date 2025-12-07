// Configuração dos verticais nichados
export type VerticalType = 
  | 'politica'
  | 'futebol'
  | 'series-filmes'
  | 'comedia'
  | 'religiao'
  | 'profissoes'
  | 'novelas'
  | 'programas-tv'
  | 'saude'
  | 'educacao'
  | 'bem-estar'
  | 'qualidade-vida'
  | 'saude-mental'
  | 'meditacao'
  | 'yoga'
  | 'nutricao'
  | 'lifestyle'
  | 'desenvolvimento-pessoal'
  | 'negocios'
  | 'fitness'
  | 'tecnologia'
  | 'marketing'
  | 'financas'
  | 'direito'
  | 'engenharia-civil'
  | 'arquitetura'
  | 'moda'
  | 'beleza'
  | 'esportes'
  | 'musica'
  | 'arte'
  | 'viagem'
  | 'games';

export interface Vertical {
  id: VerticalType;
  name: string;
  emoji: string;
  description: string;
}

export const VERTICAIS: Record<VerticalType, Vertical> = {
  'politica': {
    id: 'politica',
    name: 'Política',
    emoji: '🗳️',
    description: 'Debates, escândalos, análises políticas'
  },
  'futebol': {
    id: 'futebol',
    name: 'Futebol',
    emoji: '⚽',
    description: 'Análises de jogos, comentários, memes'
  },
  'series-filmes': {
    id: 'series-filmes',
    name: 'Séries/Filmes',
    emoji: '🎬',
    description: 'Críticas, resumos, reacts'
  },
  'comedia': {
    id: 'comedia',
    name: 'Comédia',
    emoji: '😂',
    description: 'Piadas, esquetes, humor'
  },
  'religiao': {
    id: 'religiao',
    name: 'Religião',
    emoji: '🙏',
    description: 'Pregações, estudos bíblicos, testemunhos'
  },
  'profissoes': {
    id: 'profissoes',
    name: 'Profissões',
    emoji: '💼',
    description: 'Médicos, Advogados, Engenheiros'
  },
  'novelas': {
    id: 'novelas',
    name: 'Novelas',
    emoji: '📺',
    description: 'Resumos, fofocas, entretenimento'
  },
  'programas-tv': {
    id: 'programas-tv',
    name: 'Programas TV',
    emoji: '📡',
    description: 'Talk shows, entrevistas, podcasts'
  },
  'saude': {
    id: 'saude',
    name: 'Saúde',
    emoji: '⚕️',
    description: 'Dicas de saúde, medicina, bem-estar físico'
  },
  'educacao': {
    id: 'educacao',
    name: 'Educação',
    emoji: '📚',
    description: 'Aulas, tutoriais, conteúdo educacional'
  },
  'bem-estar': {
    id: 'bem-estar',
    name: 'Bem-estar',
    emoji: '🧘',
    description: 'Equilíbrio, harmonia, qualidade de vida'
  },
  'qualidade-vida': {
    id: 'qualidade-vida',
    name: 'Qualidade de Vida',
    emoji: '✨',
    description: 'Hábitos saudáveis, rotina, bem-estar geral'
  },
  'saude-mental': {
    id: 'saude-mental',
    name: 'Saúde Mental',
    emoji: '💭',
    description: 'Psicologia, terapia, autoconhecimento'
  },
  'meditacao': {
    id: 'meditacao',
    name: 'Meditação',
    emoji: '🕉️',
    description: 'Mindfulness, relaxamento, paz interior'
  },
  'yoga': {
    id: 'yoga',
    name: 'Yoga',
    emoji: '🧘‍♀️',
    description: 'Práticas de yoga, flexibilidade, equilíbrio'
  },
  'nutricao': {
    id: 'nutricao',
    name: 'Nutrição',
    emoji: '🥗',
    description: 'Alimentação saudável, receitas, dietas'
  },
  'lifestyle': {
    id: 'lifestyle',
    name: 'Lifestyle',
    emoji: '🌟',
    description: 'Estilo de vida, rotina, hábitos'
  },
  'desenvolvimento-pessoal': {
    id: 'desenvolvimento-pessoal',
    name: 'Desenvolvimento Pessoal',
    emoji: '📈',
    description: 'Crescimento pessoal, produtividade, autoajuda'
  },
  'negocios': {
    id: 'negocios',
    name: 'Negócios',
    emoji: '💼',
    description: 'Empreendedorismo, startups, investimentos'
  },
  'fitness': {
    id: 'fitness',
    name: 'Fitness',
    emoji: '💪',
    description: 'Treinos, exercícios, musculação'
  },
  'tecnologia': {
    id: 'tecnologia',
    name: 'Tecnologia',
    emoji: '💻',
    description: 'Programação, gadgets, inovação'
  },
  'marketing': {
    id: 'marketing',
    name: 'Marketing',
    emoji: '📢',
    description: 'Estratégias, publicidade, vendas'
  },
  'financas': {
    id: 'financas',
    name: 'Finanças',
    emoji: '💰',
    description: 'Investimentos, economia, dinheiro'
  },
  'direito': {
    id: 'direito',
    name: 'Direito',
    emoji: '⚖️',
    description: 'Advocacia, leis, jurisprudência'
  },
  'engenharia-civil': {
    id: 'engenharia-civil',
    name: 'Engenharia Civil',
    emoji: '🏗️',
    description: 'Construção, obras, projetos'
  },
  'arquitetura': {
    id: 'arquitetura',
    name: 'Arquitetura',
    emoji: '🏛️',
    description: 'Projetos, design, construção'
  },
  'moda': {
    id: 'moda',
    name: 'Moda',
    emoji: '👗',
    description: 'Tendências, estilo, looks'
  },
  'beleza': {
    id: 'beleza',
    name: 'Beleza',
    emoji: '💄',
    description: 'Skincare, maquiagem, cuidados'
  },
  'esportes': {
    id: 'esportes',
    name: 'Esportes',
    emoji: '🏃',
    description: 'Esportes diversos, atletismo, competições'
  },
  'musica': {
    id: 'musica',
    name: 'Música',
    emoji: '🎵',
    description: 'Músicas, instrumentos, produção'
  },
  'arte': {
    id: 'arte',
    name: 'Arte',
    emoji: '🎨',
    description: 'Artes visuais, pintura, desenho'
  },
  'viagem': {
    id: 'viagem',
    name: 'Viagem',
    emoji: '✈️',
    description: 'Turismo, destinos, experiências'
  },
  'games': {
    id: 'games',
    name: 'Games',
    emoji: '🎮',
    description: 'Jogos, streaming, e-sports'
  }
};

export const VERTICAIS_LIST = Object.values(VERTICAIS);


