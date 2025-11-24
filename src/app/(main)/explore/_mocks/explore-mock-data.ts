import type { Animal } from "@/stores/signup-form-store";

export const BREEDER_LIST_MOCK = [
  {
    id: "1",
    avatar: "",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "available",
    animal: "cat",
  },
  {
    id: "2",
    avatar: "",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "reserved",
    animal: "dog",
  },
  {
    id: "3",
    avatar: "",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "completed",
    animal: "cat",
  },
  {
    id: "4",
    avatar: "",
    name: "범과같이",
    level: "elite",
    location: "경기도 용인시",
    price: "500,000 - 1,000,000원",
    tags: ["시베리안(트래디셔널, 네바마스커레이드)", "브리티쉬 롱헤어"],
    image: "/main-img-sample.png",
    status: "available",
    animal: "dog",
  },
] satisfies {
  id: string;
  avatar: string;
  name: string;
  level: "elite" | "new";
  location: string;
  price: string;
  tags: string[];
  image: string;
  status: "available" | "reserved" | "completed";
  animal: Animal;
}[];

export const BREEDER_DETAIL_MOCK = {
  nickname: "범과 같이",
  profile: {
    avatarUrl: "",
    nickname: "범과 같이",
    level: "elite",
    location: "경기도 용인시",
    priceRange: "500,000 - 1,000,000원",
    breeds: ["메인쿤", "러시안 블루", "샴"],
    animal: "cat" as Animal,
  },
  envPhotos: ["/login-image.png", "/main-img-sample.png"],
  description:
    "이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.이곳은 브리더에 대한 설명입니다.",
  breedingAnimals: [
    {
      id: "1",
      avatarUrl: "/animal-sample.png",
      name: "루시",
      sex: "male",
      birth: "2020-01-01",
      price: "500,000원",
      breed: "메인쿤",
    },
    {
      id: "2",
      avatarUrl: "/animal-sample.png",
      name: "코코",
      sex: "female",
      birth: "2021-01-01",
      price: "600,000원",
      breed: "러시안 블루",
    },
  ],
  parents: [
    {
      id: "1",
      avatarUrl: "/animal-sample.png",
      name: "루시",
      sex: "male",
      birth: "2020-01-01",
      price: "500,000원",
      breed: "메인쿤",
    },
    {
      id: "2",
      avatarUrl: "/animal-sample.png",
      name: "코코",
      sex: "female",
      birth: "2021-01-01",
      price: "600,000원",
      breed: "러시안 블루",
    },
  ],
  reviews: [
    {
      id: "1",
      nickname: "냥집사",
      date: "2023-10-01",
      content: "정말 좋은 브리더님이세요!",
    },
    {
      id: "2",
      nickname: "펫러버",
      date: "2023-09-15",
      content:
        "아이들이 건강하게 잘 자라고 있어요.분양 과정이 매우 친절했습니다.분양 과정이 매우 친절했습니다.분양 과정이 매우 친절했습니다.분양 과정이 매우 친절했습니다.분양 과정이 매우 친절했습니다.",
    },
    {
      id: "3",
      nickname: "고양이매니아",
      date: "2023-08-20",
      content: "분양 과정이 매우 친절했습니다.",
    },
  ],
} satisfies {
  nickname: string;
  profile: {
    avatarUrl: string;
    nickname: string;
    level: "elite" | "new";
    location: string;
    priceRange: string;
    breeds: string[];
    animal: Animal;
  };
  envPhotos: string[];
  description: string;
  breedingAnimals: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: "male" | "female";
    birth: string;
    price: string;
    breed: string;
  }[];
  parents: {
    id: string;
    avatarUrl: string;
    name: string;
    sex: "male" | "female";
    birth: string;
    price: string;
    breed: string;
  }[];
  reviews: {
    id: string;
    nickname: string;
    date: string;
    content: string;
  }[];
};
