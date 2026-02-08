/**
 * Value Parsers - 값 가공 로직
 */

/**
 * pet-selection 값 파싱
 */
export function parsePetSelectionValue(value: any): {
  animals: string[];
  animalValue: string;
  details: string;
  showDetails: boolean;
} {
  // Readonly 모드용 파싱 (객체 형식: { 0: '값1', 1: '값2', details: '...' })
  if (value && typeof value === 'object' && !Array.isArray(value) && 'details' in value) {
    const animals = Object.keys(value)
      .filter((key) => key !== 'details')
      .map((key) => value[key])
      .filter((v) => typeof v === 'string');
    return {
      animals,
      animalValue: animals.length > 0 ? animals.join('/') : '',
      details: value.details || '',
      showDetails: animals.includes('특징 직접 입력'),
    };
  }

  // View 모드용 파싱 (배열 형식)
  const animals = Array.isArray(value) ? value : value ? [value] : [];
  return {
    animals,
    animalValue: animals.length > 0 ? animals.join('/') : '',
    details: value?.details || '',
    showDetails: animals.includes('특징 직접 입력'),
  };
}
