/**
 * 홈 화면 동물 데이터 타입
 */
export interface HomeAnimalData {
  id: string; // petId (고유 키로 사용)
  breederId: string; // 브리더 프로필 연결용
  avatarUrl: string;
  name: string;
  sex: 'male' | 'female';
  birth: string;
  price: string | null; // 비로그인 시 null
  breed: string;
  status: 'available' | 'reserved' | 'completed';
}
