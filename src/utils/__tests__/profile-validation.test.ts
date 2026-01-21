import { describe, it, expect, vi } from 'vitest';
import {
  isFormEmpty,
  isParentEmpty,
  isAnimalEmpty,
  validateParents,
  validateAnimals,
  setFormErrors,
  scrollToFirstError,
} from '../profile-validation';
import type { ProfileFormData } from '@/stores/profile-store';
import { BREEDER_PROFILE_ERROR } from '@/constants/errors/breeder-profile-error';

describe('profile-validation utilities', () => {
  describe('isFormEmpty', () => {
    it('should return true for completely empty form', () => {
      const emptyForm: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(emptyForm)).toBe(true);
    });

    it('should return false when breederName is filled', () => {
      const form: ProfileFormData = {
        breederName: 'Test Breeder',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when description is filled', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: 'Test description',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when location is set', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: { province: '서울특별시', city: '강남구' },
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when breeds are selected', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: ['말티즈', '푸들'],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when prices are set', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '1000000',
        maxPrice: '2000000',
        isCounselMode: false,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when isCounselMode is true', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: true,
        parents: [],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when parents array has items with data', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [
          {
            id: '1',
            name: 'Parent Dog',
            breed: ['말티즈'],
            birthDate: '20200101',
            gender: 'male',
            photos: [],
          },
        ],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when animals array has items with data', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [],
        animals: [
          {
            id: '1',
            name: 'Puppy',
            breed: ['말티즈'],
            birthDate: '20231201',
            gender: 'female',
            adoptionStatus: 'available',
            price: '1500000',
            isCounselMode: false,
            photos: [],
          },
        ],
      };

      expect(isFormEmpty(form)).toBe(false);
    });

    it('should ignore id fields in parent/animal arrays', () => {
      const form: ProfileFormData = {
        breederName: '',
        description: '',
        location: null,
        breeds: [],
        representativePhotos: [],
        minPrice: '',
        maxPrice: '',
        isCounselMode: false,
        parents: [
          {
            id: '1',
            name: '',
            breed: [],
            birthDate: '',
            gender: null,
            photos: [],
          },
        ],
        animals: [],
      };

      expect(isFormEmpty(form)).toBe(true);
    });
  });

  describe('isParentEmpty', () => {
    it('should return true for completely empty parent', () => {
      const parent = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: null,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(true);
    });

    it('should return false when name is filled', () => {
      const parent = {
        id: '1',
        name: 'Max',
        breed: [],
        birthDate: '',
        gender: null,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should return false when breed is selected', () => {
      const parent = {
        id: '1',
        name: '',
        breed: ['말티즈'],
        birthDate: '',
        gender: null,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should return false when birthDate is set', () => {
      const parent = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '20200101',
        gender: null,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should return false when gender is set', () => {
      const parent = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: 'male' as const,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should return false when imageFiles exists', () => {
      const parent = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: null,
        photos: [new File([''], 'test.jpg')],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should return false when imagePreviews exists', () => {
      const parent = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: null,
        photos: ['data:image/jpeg;base64,test'],
      };

      expect(isParentEmpty(parent)).toBe(false);
    });

    it('should handle whitespace-only name as empty', () => {
      const parent = {
        id: '1',
        name: '   ',
        breed: [],
        birthDate: '',
        gender: null,
        photos: [],
      };

      expect(isParentEmpty(parent)).toBe(true);
    });
  });

  describe('isAnimalEmpty', () => {
    it('should return true for completely empty animal', () => {
      const animal = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: null,
        adoptionStatus: '',
        price: '',
        isCounselMode: false,
        photos: [],
      };

      expect(isAnimalEmpty(animal)).toBe(true);
    });

    it('should return false when any field is filled', () => {
      expect(
        isAnimalEmpty({
          id: '1',
          name: 'Puppy',
          breed: [],
          birthDate: '',
          gender: null,
          adoptionStatus: '',
          price: '',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);

      expect(
        isAnimalEmpty({
          id: '1',
          name: '',
          breed: ['말티즈'],
          birthDate: '',
          gender: null,
          adoptionStatus: '',
          price: '',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);

      expect(
        isAnimalEmpty({
          id: '1',
          name: '',
          breed: [],
          birthDate: '20231201',
          gender: null,
          adoptionStatus: '',
          price: '',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);

      expect(
        isAnimalEmpty({
          id: '1',
          name: '',
          breed: [],
          birthDate: '',
          gender: 'female' as const,
          adoptionStatus: '',
          price: '',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);

      expect(
        isAnimalEmpty({
          id: '1',
          name: '',
          breed: [],
          birthDate: '',
          gender: null,
          adoptionStatus: 'available',
          price: '',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);

      expect(
        isAnimalEmpty({
          id: '1',
          name: '',
          breed: [],
          birthDate: '',
          gender: null,
          adoptionStatus: '',
          price: '1500000',
          isCounselMode: false,
          photos: [],
        }),
      ).toBe(false);
    });
  });

  describe('validateParents', () => {
    it('should return undefined for empty parents', () => {
      const parents = [
        {
          id: '1',
          name: '',
          breed: [],
          birthDate: '',
          gender: null,
          photos: [],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]).toBeUndefined();
    });

    it('should validate name is required', () => {
      const parents = [
        {
          id: '1',
          name: '',
          breed: ['말티즈'],
          birthDate: '20200101',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.name).toBe(BREEDER_PROFILE_ERROR.NAME_REQUIRED);
    });

    it('should validate breed is required', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: [],
          birthDate: '20200101',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.breed).toBe(BREEDER_PROFILE_ERROR.BREEDS_REQUIRED);
    });

    it('should validate birthDate is required', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED);
    });

    it('should validate birthDate format (YYYYMMDD)', () => {
      const invalidDates = ['2020/01/01', '2020-01-01', '20200132', '20201301', '123', 'invalid'];

      invalidDates.forEach((date) => {
        const parents = [
          {
            id: '1',
            name: 'Max',
            breed: ['말티즈'],
            birthDate: date,
            gender: 'male' as const,
            photos: [new File([''], 'test.jpg')],
          },
        ];

        const errors = validateParents(parents);
        expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
      });
    });

    it('should accept valid birthDate formats', () => {
      const validDates = ['20200101', '19990615', '20231231'];

      validDates.forEach((date) => {
        const parents = [
          {
            id: '1',
            name: 'Max',
            breed: ['말티즈'],
            birthDate: date,
            gender: 'male' as const,
            photos: [new File([''], 'test.jpg')],
          },
        ];

        const errors = validateParents(parents);
        expect(errors[0]?.birthDate).toBeUndefined();
      });
    });

    it('should validate gender is required', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200101',
          gender: null,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.gender).toBe(BREEDER_PROFILE_ERROR.GENDER_REQUIRED);
    });

    it('should validate image is required', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200101',
          gender: 'male' as const,
          photos: [],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.image).toBe('사진을 등록해 주세요');
    });

    it('should return undefined when all fields are valid', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200101',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]).toBeUndefined();
    });

    it('should validate multiple parents independently', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200101',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
        {
          id: '2',
          name: '',
          breed: ['푸들'],
          birthDate: '20210101',
          gender: 'female' as const,
          photos: [new File([''], 'test2.jpg')],
        },
        {
          id: '3',
          name: '',
          breed: [],
          birthDate: '',
          gender: null,
          photos: [],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]).toBeUndefined(); // Valid
      expect(errors[1]?.name).toBe(BREEDER_PROFILE_ERROR.NAME_REQUIRED); // Invalid
      expect(errors[2]).toBeUndefined(); // Empty, skipped
    });
  });

  describe('validateAnimals', () => {
    it('should return undefined for empty animals', () => {
      const animals = [
        {
          id: '1',
          name: '',
          breed: [],
          birthDate: '',
          gender: null,
          adoptionStatus: '',
          price: '',
          isCounselMode: false,
          photos: [],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]).toBeUndefined();
    });

    it('should validate all required fields', () => {
      const animal = {
        id: '1',
        name: '',
        breed: [],
        birthDate: '',
        gender: null,
        adoptionStatus: '',
        price: '',
        isCounselMode: false,
        photos: [],
      };

      // Add just name to make it non-empty
      const animals = [{ ...animal, name: 'Puppy' }];
      const errors = validateAnimals(animals);

      expect(errors[0]?.breed).toBe(BREEDER_PROFILE_ERROR.BREEDS_REQUIRED);
      expect(errors[0]?.adoptionStatus).toBe(BREEDER_PROFILE_ERROR.STATUS_REQUIRED);
      expect(errors[0]?.price).toBe(BREEDER_PROFILE_ERROR.PRICE_REQUIRED);
      expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_REQUIRED);
      expect(errors[0]?.gender).toBe(BREEDER_PROFILE_ERROR.GENDER_REQUIRED);
      expect(errors[0]?.image).toBe('사진을 등록해 주세요');
    });

    it('should skip price validation when isCounselMode is true', () => {
      const animals = [
        {
          id: '1',
          name: 'Puppy',
          breed: ['말티즈'],
          birthDate: '20231201',
          gender: 'female' as const,
          adoptionStatus: 'available',
          price: '',
          isCounselMode: true,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]?.price).toBeUndefined();
    });

    it('should require price when isCounselMode is false', () => {
      const animals = [
        {
          id: '1',
          name: 'Puppy',
          breed: ['말티즈'],
          birthDate: '20231201',
          gender: 'female' as const,
          adoptionStatus: 'available',
          price: '',
          isCounselMode: false,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]?.price).toBe(BREEDER_PROFILE_ERROR.PRICE_REQUIRED);
    });

    it('should validate birthDate format', () => {
      const animals = [
        {
          id: '1',
          name: 'Puppy',
          breed: ['말티즈'],
          birthDate: 'invalid',
          gender: 'female' as const,
          adoptionStatus: 'available',
          price: '1500000',
          isCounselMode: false,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
    });

    it('should accept imagePreviews as alternative to imageFiles', () => {
      const animals = [
        {
          id: '1',
          name: 'Puppy',
          breed: ['말티즈'],
          birthDate: '20231201',
          gender: 'female' as const,
          adoptionStatus: 'available',
          price: '1500000',
          isCounselMode: false,
          photos: ['data:image/jpeg;base64,test'],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]?.image).toBeUndefined();
    });

    it('should return undefined when all fields are valid', () => {
      const animals = [
        {
          id: '1',
          name: 'Puppy',
          breed: ['말티즈'],
          birthDate: '20231201',
          gender: 'female' as const,
          adoptionStatus: 'available',
          price: '1500000',
          isCounselMode: false,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateAnimals(animals);
      expect(errors[0]).toBeUndefined();
    });
  });

  describe('edge cases for birthDate validation', () => {
    it('should reject invalid month values', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20201301', // Month 13
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
    });

    it('should reject invalid day values', () => {
      const parents = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200132', // Day 32
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(parents);
      expect(errors[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
    });

    it('should handle leap year dates correctly', () => {
      const validLeapYear = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200229', // Valid leap year date
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors = validateParents(validLeapYear);
      expect(errors[0]?.birthDate).toBeUndefined();

      const invalidNonLeapYear = [
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20210229', // Invalid non-leap year date
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ];

      const errors2 = validateParents(invalidNonLeapYear);
      expect(errors2[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
    });

    it('should handle different month lengths', () => {
      // February in non-leap year
      const feb29 = validateParents([
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20190229',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ]);
      expect(feb29[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);

      // April has 30 days
      const apr31 = validateParents([
        {
          id: '1',
          name: 'Max',
          breed: ['말티즈'],
          birthDate: '20200431',
          gender: 'male' as const,
          photos: [new File([''], 'test.jpg')],
        },
      ]);
      expect(apr31[0]?.birthDate).toBe(BREEDER_PROFILE_ERROR.BIRTH_DATE_INVALID);
    });
  });

  describe('setFormErrors', () => {
    it('should return false when no errors exist', () => {
      const mockForm = {
        setError: vi.fn(),
      } as any;

      const errors = [undefined, undefined];
      const result = setFormErrors(mockForm, errors, 'parents');

      expect(result).toBe(false);
      expect(mockForm.setError).not.toHaveBeenCalled();
    });

    it('should set errors and return true when errors exist', () => {
      const mockForm = {
        setError: vi.fn(),
      } as any;

      const errors = [
        { name: 'Name is required', breed: 'Breed is required' },
        undefined,
        { birthDate: 'Birth date is invalid' },
      ];

      const result = setFormErrors(mockForm, errors, 'parents');

      expect(result).toBe(true);
      expect(mockForm.setError).toHaveBeenCalledTimes(3);
      expect(mockForm.setError).toHaveBeenCalledWith(
        'parents.0.name',
        { type: 'manual', message: 'Name is required' },
        { shouldFocus: false },
      );
      expect(mockForm.setError).toHaveBeenCalledWith(
        'parents.0.breed',
        { type: 'manual', message: 'Breed is required' },
        { shouldFocus: false },
      );
      expect(mockForm.setError).toHaveBeenCalledWith(
        'parents.2.birthDate',
        { type: 'manual', message: 'Birth date is invalid' },
        { shouldFocus: false },
      );
    });
  });

  describe('scrollToFirstError', () => {
    it('should scroll to first parent error', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);
      vi.useFakeTimers();

      const parentErrors = [undefined, { name: 'Error' }, undefined];
      const animalErrors = [undefined, undefined];

      scrollToFirstError(parentErrors, animalErrors);

      vi.advanceTimersByTime(100);

      expect(document.querySelector).toHaveBeenCalledWith('[data-parent-index="1"]');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });

      vi.useRealTimers();
    });

    it('should scroll to first animal error when no parent errors', () => {
      const mockElement = {
        scrollIntoView: vi.fn(),
      };

      vi.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);
      vi.useFakeTimers();

      const parentErrors = [undefined, undefined];
      const animalErrors = [undefined, { name: 'Error' }, undefined];

      scrollToFirstError(parentErrors, animalErrors);

      vi.advanceTimersByTime(100);

      expect(document.querySelector).toHaveBeenCalledWith('[data-animal-index="1"]');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });

      vi.useRealTimers();
    });

    it('should not scroll when no errors exist', () => {
      vi.spyOn(document, 'querySelector');
      vi.useFakeTimers();

      const parentErrors = [undefined, undefined];
      const animalErrors = [undefined, undefined];

      scrollToFirstError(parentErrors, animalErrors);

      vi.advanceTimersByTime(100);

      expect(document.querySelector).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});