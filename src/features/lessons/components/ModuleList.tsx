import React from 'react';
import { View } from 'react-native';

import { ModuleCard } from '@/components/module-card';
import type { LearningModule } from '@/types';

type ModuleListProps = {
  modules: LearningModule[];
  onModulePress: (moduleId: string) => void;
  onModulePractice: (moduleId: string) => void;
};

export function ModuleList({ modules, onModulePress, onModulePractice }: ModuleListProps) {
  return (
    <View style={{ width: '100%' }}>
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          onPress={() => onModulePress(module.id)}
          onPractice={() => onModulePractice(module.id)}
        />
      ))}
    </View>
  );
}
