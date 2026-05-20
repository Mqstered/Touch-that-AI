import React, { createContext, useMemo, useState, type ReactNode } from 'react';

import { learningModules, type LearningModule } from '@/data/learning-modules';

export type LearningContextValue = {
  modules: LearningModule[];
  averageMastery: number;
  totalLessons: number;
  practiceModule: (moduleId: string) => void;
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<LearningModule[]>(learningModules);

  const practiceModule = (moduleId: string) => {
    setModules((previous) =>
      previous.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }

        const nextMastery = Math.min(100, module.mastery + 14);
        return {
          ...module,
          mastery: nextMastery,
          progress: nextMastery,
          updatedAt: 'Just now',
        };
      }),
    );
  };

  const averageMastery = useMemo(
    () => Math.round(modules.reduce((sum, item) => sum + item.mastery, 0) / modules.length),
    [modules],
  );

  const totalLessons = useMemo(
    () => modules.reduce((sum, item) => sum + item.lessons, 0),
    [modules],
  );

  const value = useMemo(
    () => ({ modules, averageMastery, totalLessons, practiceModule }),
    [modules, averageMastery, totalLessons],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearningContext() {
  const context = React.useContext(LearningContext);
  if (!context) {
    throw new Error('useLearningContext must be used within LearningProvider');
  }
  return context;
}
