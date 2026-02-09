export const formatPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

export const isCompletePhoneNumber = (value: string): boolean => {
  // 유연한 전화번호 형식 허용: 02-123-4567, 010-1234-5678, 031-123-4567 등
  return /^\d{2,3}-\d{3,4}-\d{4}$/.test(value);
};
