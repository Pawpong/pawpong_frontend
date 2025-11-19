"use client";

import AnimalCategoryCards, {
  type AnimalCategoryCard,
} from "@/components/animal-category-cards";
import SignupFormItems from "@/components/signup-form-section/signup-form-items";
import SignupFormSection from "@/components/signup-form-section/signup-form-section";
import SignupFormTitle from "@/components/signup-form-section/signup-form-title";
import UndoButton from "@/components/signup-form-section/undo-button";
import useSignupFormStore, { Animal } from "@/stores/signup-form-store";

const animalInfo: AnimalCategoryCard[] = [
  {
    name: "cat",
    label: "고양이",
    className: "bg-primary hover:bg-primary-600 text-tertiary-500",
    src: "/images/cat.png",
  },
  {
    name: "dog",
    label: "강아지",
    className: "bg-secondary hover:bg-secondary-600 text-primary!",
    src: "/images/dog.png",
  },
];

export default function AnimalSection() {
  const setAnimal = useSignupFormStore((e) => e.setAnimal);
  const nextFlowIndex = useSignupFormStore((e) => e.nextFlowIndex);

  const animalsWithOnClick = animalInfo.map((animal) => ({
    ...animal,
    onClick: () => {
      setAnimal(animal.name as Animal);
      nextFlowIndex();
    },
  }));

  return (
    <SignupFormSection>
      <SignupFormTitle>어떤 동물을 브리딩하시나요?</SignupFormTitle>
      <SignupFormItems>
        <AnimalCategoryCards animals={animalsWithOnClick} size="default" />
      </SignupFormItems>
      <UndoButton />
    </SignupFormSection>
  );
}
