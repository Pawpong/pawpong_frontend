/**
 * 홈 화면 동물 데이터 타입
 */
export interface HomeAnimalData {
  id: string;
  avatarUrl: string;
  name: string;
  sex: "male" | "female";
  birth: string;
  price: string;
  breed: string;
  status: "available" | "reserved" | "completed";
}
