import AppTabs from '@/components/app-tabs';
import { LearningProvider } from '@/context/learning-context';

export default function Layout() {
  return (
    <LearningProvider>
      <AppTabs />
    </LearningProvider>
  );
}
