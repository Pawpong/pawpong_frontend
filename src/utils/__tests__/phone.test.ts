import { describe, it, expect } from 'vitest';
import { formatPhoneNumber, isCompletePhoneNumber } from '../phone';

describe('phone utilities', () => {
  describe('formatPhoneNumber', () => {
    describe('happy path', () => {
      it('should format a complete 11-digit phone number correctly', () => {
        expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
      });

      it('should format a 10-digit phone number correctly', () => {
        expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
      });

      it('should handle already formatted numbers', () => {
        expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
      });
    });

    describe('partial input scenarios', () => {
      it('should return unformatted string for 3 or fewer digits', () => {
        expect(formatPhoneNumber('0')).toBe('0');
        expect(formatPhoneNumber('01')).toBe('01');
        expect(formatPhoneNumber('010')).toBe('010');
      });

      it('should format 4-7 digits with first hyphen only', () => {
        expect(formatPhoneNumber('0101')).toBe('010-1');
        expect(formatPhoneNumber('01012')).toBe('010-12');
        expect(formatPhoneNumber('010123')).toBe('010-123');
        expect(formatPhoneNumber('0101234')).toBe('010-1234');
      });

      it('should format 8-11 digits with both hyphens', () => {
        expect(formatPhoneNumber('01012345')).toBe('010-1234-5');
        expect(formatPhoneNumber('010123456')).toBe('010-1234-56');
        expect(formatPhoneNumber('0101234567')).toBe('010-1234-567');
        expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
      });
    });

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(formatPhoneNumber('')).toBe('');
      });

      it('should strip non-digit characters', () => {
        expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('010.1234.5678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('010 1234 5678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('(010)1234-5678')).toBe('010-1234-5678');
      });

      it('should truncate to maximum 11 digits', () => {
        expect(formatPhoneNumber('010123456789')).toBe('010-1234-5678');
        expect(formatPhoneNumber('0101234567890')).toBe('010-1234-5678');
      });

      it('should handle mixed alphanumeric input', () => {
        expect(formatPhoneNumber('010abc1234def5678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('abc010def1234ghi5678')).toBe('010-1234-5678');
      });

      it('should handle special characters and symbols', () => {
        expect(formatPhoneNumber('010@1234#5678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('010!1234$5678%')).toBe('010-1234-5678');
      });

      it('should handle international format inputs', () => {
        expect(formatPhoneNumber('+821012345678')).toBe('821-0123-4567');
        expect(formatPhoneNumber('+82-10-1234-5678')).toBe('821-0123-4567');
      });
    });

    describe('various area codes', () => {
      it('should handle Seoul area code (02)', () => {
        expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678');
        expect(formatPhoneNumber('021234567')).toBe('02-1234-567');
      });

      it('should handle other area codes', () => {
        expect(formatPhoneNumber('0311234567')).toBe('031-1234-567');
        expect(formatPhoneNumber('05112345678')).toBe('051-1234-5678');
      });

      it('should handle mobile prefixes', () => {
        expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
        expect(formatPhoneNumber('01112345678')).toBe('011-1234-5678');
        expect(formatPhoneNumber('01612345678')).toBe('016-1234-5678');
        expect(formatPhoneNumber('01712345678')).toBe('017-1234-5678');
        expect(formatPhoneNumber('01812345678')).toBe('018-1234-5678');
        expect(formatPhoneNumber('01912345678')).toBe('019-1234-5678');
      });
    });
  });

  describe('isCompletePhoneNumber', () => {
    describe('valid complete numbers', () => {
      it('should return true for correctly formatted 11-digit numbers', () => {
        expect(isCompletePhoneNumber('010-1234-5678')).toBe(true);
        expect(isCompletePhoneNumber('011-1234-5678')).toBe(true);
        expect(isCompletePhoneNumber('016-9999-0000')).toBe(true);
      });
    });

    describe('invalid numbers', () => {
      it('should return false for incomplete numbers', () => {
        expect(isCompletePhoneNumber('010-1234-567')).toBe(false);
        expect(isCompletePhoneNumber('010-123-5678')).toBe(false);
        expect(isCompletePhoneNumber('010-1234')).toBe(false);
      });

      it('should return false for unformatted numbers', () => {
        expect(isCompletePhoneNumber('01012345678')).toBe(false);
        expect(isCompletePhoneNumber('010 1234 5678')).toBe(false);
      });

      it('should return false for empty or whitespace strings', () => {
        expect(isCompletePhoneNumber('')).toBe(false);
        expect(isCompletePhoneNumber('   ')).toBe(false);
      });

      it('should return false for numbers with wrong format', () => {
        expect(isCompletePhoneNumber('010.1234.5678')).toBe(false);
        expect(isCompletePhoneNumber('010/1234/5678')).toBe(false);
        expect(isCompletePhoneNumber('(010)1234-5678')).toBe(false);
      });

      it('should return false for numbers with too many or too few digits', () => {
        expect(isCompletePhoneNumber('010-12345-5678')).toBe(false);
        expect(isCompletePhoneNumber('010-1234-56789')).toBe(false);
        expect(isCompletePhoneNumber('01-1234-5678')).toBe(false);
      });

      it('should return false for numbers with letters', () => {
        expect(isCompletePhoneNumber('010-abcd-5678')).toBe(false);
        expect(isCompletePhoneNumber('abc-1234-5678')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle exactly matching pattern', () => {
        expect(isCompletePhoneNumber('000-0000-0000')).toBe(true);
        expect(isCompletePhoneNumber('999-9999-9999')).toBe(true);
      });

      it('should be strict about format', () => {
        expect(isCompletePhoneNumber(' 010-1234-5678')).toBe(false);
        expect(isCompletePhoneNumber('010-1234-5678 ')).toBe(false);
        expect(isCompletePhoneNumber(' 010-1234-5678 ')).toBe(false);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should format and validate a user input journey', () => {
      // User starts typing
      let input = '0';
      expect(formatPhoneNumber(input)).toBe('0');
      expect(isCompletePhoneNumber(formatPhoneNumber(input))).toBe(false);

      // User types more
      input = '010';
      expect(formatPhoneNumber(input)).toBe('010');
      expect(isCompletePhoneNumber(formatPhoneNumber(input))).toBe(false);

      // First hyphen appears
      input = '0101';
      expect(formatPhoneNumber(input)).toBe('010-1');
      expect(isCompletePhoneNumber(formatPhoneNumber(input))).toBe(false);

      // Continue typing
      input = '0101234';
      expect(formatPhoneNumber(input)).toBe('010-1234');
      expect(isCompletePhoneNumber(formatPhoneNumber(input))).toBe(false);

      // Second hyphen appears
      input = '01012345';
      expect(formatPhoneNumber(input)).toBe('010-1234-5');
      expect(isCompletePhoneNumber(formatPhoneNumber(input))).toBe(false);

      // Complete number
      input = '01012345678';
      const formatted = formatPhoneNumber(input);
      expect(formatted).toBe('010-1234-5678');
      expect(isCompletePhoneNumber(formatted)).toBe(true);
    });

    it('should handle copy-paste with various formats', () => {
      const variations = [
        '010-1234-5678',
        '010.1234.5678',
        '010 1234 5678',
        '01012345678',
        '(010) 1234-5678',
      ];

      variations.forEach((input) => {
        const formatted = formatPhoneNumber(input);
        expect(formatted).toBe('010-1234-5678');
        expect(isCompletePhoneNumber(formatted)).toBe(true);
      });
    });
  });
});