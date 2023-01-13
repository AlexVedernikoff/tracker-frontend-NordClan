import { createContext, useContext } from 'react';

export const GuideContext = createContext<{ guide: Generator<void, void, unknown> | null }>({
  guide: null
});

export function useGuideContext() {
  const context = useContext(GuideContext);

  if (context === undefined) {
    throw new Error('useGuideContext must be used within a GuideProvider');
  }

  return context;
}
