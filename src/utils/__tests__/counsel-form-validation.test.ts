import { describe, it, expect } from 'vitest';
import { isFormEmpty, isFormComplete } from '../counsel-form-validation';
import type { CounselFormData } from '@/stores/counsel-form-store';

describe('counsel-form-validation utilities', () => {
  const createEmptyForm = (): CounselFormData => ({
    privacyAgreement: false,
    name: '',
    phone: '',
    email: '',
    introduction: '',
    familyMembers: '',
    familyAgreement: false,
    allergyCheck: '',
    awayTime: '',
    livingSpace: '',
    previousPets: '',
    basicCare: false,
    medicalExpense: false,
    interestedAnimal: [],
    interestedAnimalDetails: '',
    adoptionTiming: '',
    additionalMessage: '',
  });

  describe('isFormEmpty', () => {
    it('should return true for completely empty form', () => {
      const form = createEmptyForm();
      expect(isFormEmpty(form)).toBe(true);
    });

    it('should return false when privacyAgreement is checked', () => {
      const form = { ...createEmptyForm(), privacyAgreement: true };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when name is filled', () => {
      const form = { ...createEmptyForm(), name: '홍길동' };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when phone is filled', () => {
      const form = { ...createEmptyForm(), phone: '010-1234-5678' };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when email is filled', () => {
      const form = { ...createEmptyForm(), email: 'test@example.com' };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when introduction is filled', () => {
      const form = { ...createEmptyForm(), introduction: '안녕하세요' };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should return false when any boolean field is true', () => {
      expect(isFormEmpty({ ...createEmptyForm(), familyAgreement: true })).toBe(false);
      expect(isFormEmpty({ ...createEmptyForm(), basicCare: true })).toBe(false);
      expect(isFormEmpty({ ...createEmptyForm(), medicalExpense: true })).toBe(false);
    });

    it('should return false when interestedAnimal has items', () => {
      const form = { ...createEmptyForm(), interestedAnimal: ['활발한 성격'] };
      expect(isFormEmpty(form)).toBe(false);
    });

    it('should handle whitespace-only strings as empty', () => {
      const form = {
        ...createEmptyForm(),
        name: '   ',
        email: '  ',
        introduction: '\t\n',
      };
      expect(isFormEmpty(form)).toBe(true);
    });

    it('should return false when multiple fields are filled', () => {
      const form = {
        ...createEmptyForm(),
        name: '홍길동',
        phone: '010-1234-5678',
        email: 'test@example.com',
      };
      expect(isFormEmpty(form)).toBe(false);
    });
  });

  describe('isFormComplete', () => {
    const createCompleteForm = (): CounselFormData => ({
      privacyAgreement: true,
      name: '홍길동',
      phone: '010-1234-5678',
      email: 'test@example.com',
      introduction: '반려동물을 사랑합니다',
      familyMembers: '4명',
      familyAgreement: true,
      allergyCheck: '없음',
      awayTime: '하루 4시간',
      livingSpace: '아파트',
      previousPets: '강아지 키운 경험 있음',
      basicCare: true,
      medicalExpense: true,
      interestedAnimal: ['활발한 성격'],
      interestedAnimalDetails: '',
      adoptionTiming: '즉시',
      additionalMessage: '잘 부탁드립니다',
    });

    describe('all required fields', () => {
      it('should return true when all required fields are filled correctly', () => {
        const form = createCompleteForm();
        expect(isFormComplete(form)).toBe(true);
      });

      it('should return false when privacyAgreement is not checked', () => {
        const form = { ...createCompleteForm(), privacyAgreement: false };
        expect(isFormComplete(form)).toBe(false);
      });

      it('should return false when name is empty', () => {
        const form = { ...createCompleteForm(), name: '' };
        expect(isFormComplete(form)).toBe(false);
      });

      it('should return false when familyAgreement is not checked', () => {
        const form = { ...createCompleteForm(), familyAgreement: false };
        expect(isFormComplete(form)).toBe(false);
      });

      it('should return false when basicCare is not checked', () => {
        const form = { ...createCompleteForm(), basicCare: false };
        expect(isFormComplete(form)).toBe(false);
      });

      it('should return false when medicalExpense is not checked', () => {
        const form = { ...createCompleteForm(), medicalExpense: false };
        expect(isFormComplete(form)).toBe(false);
      });
    });

    describe('phone validation', () => {
      it('should accept valid phone format', () => {
        const form = { ...createCompleteForm(), phone: '010-1234-5678' };
        expect(isFormComplete(form)).toBe(true);
      });

      it('should reject invalid phone formats', () => {
        const invalidPhones = [
          '01012345678',
          '010-123-5678',
          '010-1234-567',
          '010 1234 5678',
          'invalid',
          '',
        ];

        invalidPhones.forEach((phone) => {
          const form = { ...createCompleteForm(), phone };
          expect(isFormComplete(form)).toBe(false);
        });
      });

      it('should reject incomplete phone numbers', () => {
        const form = { ...createCompleteForm(), phone: '010-1234' };
        expect(isFormComplete(form)).toBe(false);
      });
    });

    describe('email validation', () => {
      it('should accept valid email formats', () => {
        const validEmails = [
          'test@example.com',
          'user@domain.co.kr',
          'name.surname@company.com',
          'user+tag@example.com',
        ];

        validEmails.forEach((email) => {
          const form = { ...createCompleteForm(), email };
          expect(isFormComplete(form)).toBe(true);
        });
      });

      it('should reject invalid email formats', () => {
        const invalidEmails = ['invalid', 'no-at-sign', '@example.com', 'user@', ''];

        invalidEmails.forEach((email) => {
          const form = { ...createCompleteForm(), email };
          expect(isFormComplete(form)).toBe(false);
        });
      });
    });

    describe('interestedAnimal and interestedAnimalDetails validation', () => {
      it('should accept when interestedAnimal does not include "특징 직접 입력"', () => {
        const form = {
          ...createCompleteForm(),
          interestedAnimal: ['활발한 성격', '온순한 성격'],
          interestedAnimalDetails: '',
        };
        expect(isFormComplete(form)).toBe(true);
      });

      it('should require interestedAnimalDetails when "특징 직접 입력" is selected', () => {
        const formWithoutDetails = {
          ...createCompleteForm(),
          interestedAnimal: ['활발한 성격', '특징 직접 입력'],
          interestedAnimalDetails: '',
        };
        expect(isFormComplete(formWithoutDetails)).toBe(false);

        const formWithDetails = {
          ...createCompleteForm(),
          interestedAnimal: ['활발한 성격', '특징 직접 입력'],
          interestedAnimalDetails: '사람을 좋아하는 아이',
        };
        expect(isFormComplete(formWithDetails)).toBe(true);
      });

      it('should accept whitespace in interestedAnimalDetails when "특징 직접 입력" is not selected', () => {
        const form = {
          ...createCompleteForm(),
          interestedAnimal: ['활발한 성격'],
          interestedAnimalDetails: '   ',
        };
        expect(isFormComplete(form)).toBe(true);
      });

      it('should reject whitespace-only interestedAnimalDetails when "특징 직접 입력" is selected', () => {
        const form = {
          ...createCompleteForm(),
          interestedAnimal: ['특징 직접 입력'],
          interestedAnimalDetails: '   ',
        };
        expect(isFormComplete(form)).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty interestedAnimal array', () => {
        const form = { ...createCompleteForm(), interestedAnimal: [] };
        expect(isFormComplete(form)).toBe(false);
      });

      it('should reject whitespace-only required string fields', () => {
        const fields: (keyof CounselFormData)[] = [
          'name',
          'introduction',
          'familyMembers',
          'allergyCheck',
          'awayTime',
          'livingSpace',
          'previousPets',
          'adoptionTiming',
          'additionalMessage',
        ];

        fields.forEach((field) => {
          const form = { ...createCompleteForm(), [field]: '   ' };
          expect(isFormComplete(form)).toBe(false);
        });
      });

      it('should require all text fields to have actual content', () => {
        const form = createCompleteForm();
        
        // Test each required text field individually
        expect(isFormComplete({ ...form, introduction: '' })).toBe(false);
        expect(isFormComplete({ ...form, familyMembers: '' })).toBe(false);
        expect(isFormComplete({ ...form, allergyCheck: '' })).toBe(false);
        expect(isFormComplete({ ...form, awayTime: '' })).toBe(false);
        expect(isFormComplete({ ...form, livingSpace: '' })).toBe(false);
        expect(isFormComplete({ ...form, previousPets: '' })).toBe(false);
        expect(isFormComplete({ ...form, adoptionTiming: '' })).toBe(false);
        expect(isFormComplete({ ...form, additionalMessage: '' })).toBe(false);
      });
    });

    describe('combination scenarios', () => {
      it('should validate all conditions together', () => {
        const invalidCombinations = [
          { ...createCompleteForm(), phone: 'invalid', email: 'invalid' },
          { ...createCompleteForm(), privacyAgreement: false, familyAgreement: false },
          { ...createCompleteForm(), basicCare: false, medicalExpense: false },
          {
            ...createCompleteForm(),
            interestedAnimal: ['특징 직접 입력'],
            interestedAnimalDetails: '',
          },
        ];

        invalidCombinations.forEach((form) => {
          expect(isFormComplete(form)).toBe(false);
        });
      });

      it('should handle partial completion correctly', () => {
        const partialForm = {
          ...createEmptyForm(),
          privacyAgreement: true,
          name: '홍길동',
          phone: '010-1234-5678',
          // Missing other required fields
        };

        expect(isFormComplete(partialForm)).toBe(false);
      });
    });
  });

  describe('integration with isFormEmpty', () => {
    it('should handle transition from empty to complete', () => {
      let form = createEmptyForm();
      expect(isFormEmpty(form)).toBe(true);
      expect(isFormComplete(form)).toBe(false);

      // Add one field
      form = { ...form, name: '홍길동' };
      expect(isFormEmpty(form)).toBe(false);
      expect(isFormComplete(form)).toBe(false);

      // Complete all fields
      form = {
        privacyAgreement: true,
        name: '홍길동',
        phone: '010-1234-5678',
        email: 'test@example.com',
        introduction: '반려동물을 사랑합니다',
        familyMembers: '4명',
        familyAgreement: true,
        allergyCheck: '없음',
        awayTime: '하루 4시간',
        livingSpace: '아파트',
        previousPets: '강아지 키운 경험 있음',
        basicCare: true,
        medicalExpense: true,
        interestedAnimal: ['활발한 성격'],
        interestedAnimalDetails: '',
        adoptionTiming: '즉시',
        additionalMessage: '잘 부탁드립니다',
      };
      expect(isFormEmpty(form)).toBe(false);
      expect(isFormComplete(form)).toBe(true);
    });
  });
});