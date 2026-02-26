'use client';

import Container from '@/components/ui/container';
import { AnimalTabBar, type AnimalType } from '@/components/animal-tab-bar';
import useAnimal from '@/hooks/use-animal';
import { useCallback } from 'react';

export default function AnimalTabs() {
  const currTab = useAnimal();

  const getHref = useCallback((animal: AnimalType) => `/explore/${animal}`, []);

  return (
    <Container className="pt-6 md:pt-7 lg:pt-10">
      <AnimalTabBar activeAnimal={currTab} getHref={getHref} />
    </Container>
  );
}
