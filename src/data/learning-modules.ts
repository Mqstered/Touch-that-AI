export type LearningModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  mastery: number;
  lessons: number;
  progress: number;
  updatedAt: string;
  category: string;
};

export const learningModules: LearningModule[] = [
  {
    id: 'prompt-design',
    title: 'Prompt Design',
    subtitle: 'Write clear AI instructions',
    description:
      'Learn how to phrase requests for accurate answers, useful examples, and consistent output style.',
    focus: 'Structure prompts with context, examples, and desired results.',
    mastery: 42,
    lessons: 6,
    progress: 42,
    updatedAt: 'Today',
    category: 'Core',
  },
  {
    id: 'ai-safety',
    title: 'AI Safety',
    subtitle: 'Guard responsible AI use',
    description:
      'Study ethical prompts, biases, and guardrails to keep outputs reliable and aligned with your goals.',
    focus: 'Review examples and use safe prompt patterns.',
    mastery: 58,
    lessons: 4,
    progress: 58,
    updatedAt: 'Yesterday',
    category: 'Safety',
  },
  {
    id: 'knowledge-tracing',
    title: 'Knowledge Tracing',
    subtitle: 'Track learning progress',
    description:
      'Practice adaptive learning and see how performance changes across sequenced AI exercises.',
    focus: 'Use quick practice to strengthen weak areas.',
    mastery: 33,
    lessons: 5,
    progress: 33,
    updatedAt: '2 days ago',
    category: 'Analytics',
  },
];
