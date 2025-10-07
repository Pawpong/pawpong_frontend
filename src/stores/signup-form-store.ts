import { create } from "zustand";

// usertype 타입 정의
export type UserType = "guest" | "breeder";
export type Animal = "cat" | "dog";
export type Plan = "basic" | "pro";
export type AgreementName = "term" | "privacy" | "marketing";

interface SignupFormStore {
  userType?: UserType;
  setUserType: (newType: UserType) => void;

  animal?: Animal;
  setAnimal: (animal: Animal) => void;

  plan?: Plan;
  setPlan: (plan: Plan) => void;

  // social login info
  tempId: string;
  setTempId: (tempId: string) => void;

  provider: string;
  setProvider: (provider: string) => void;

  socialName: string;
  setSocialName: (name: string) => void;

  profileImage: string;
  setProfileImage: (url: string) => void;

  // user info
  agreements: { term: boolean; privacy: boolean; marketing: boolean };
  setAgreements: (name: AgreementName, value: boolean) => void;

  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;

  email: string;
  setEmail: (email: string) => void;

  // breeder info
  photo: File | null;
  setPhoto: (photo: File | null) => void;
  photoPreview: string;
  setPhotoPreview: (preview: string) => void;

  breederName: string;
  setBreederName: (name: string) => void;

  breederDescription: string;
  setBreederDescription: (description: string) => void;

  breederLocation: string | null;
  setBreederLocation: (location: string | null) => void;

  breeds: string[];
  setBreeds: (breed: string[]) => void;

  // document
  level: "elite" | "new";
  setLevel: (level: "elite" | "new") => void;

  nickname: string;
  setNickname: (nickname: string) => void;

  flowIndex: number;
  nextFlowIndex: () => void;
  prevFlowIndex: () => void;

  documents: Record<string, File | null>;
  setDocuments: (name: string, file: File | null) => void;
  resetFlowIndex: () => void;
}

const useSignupFormStore = create<SignupFormStore>((set) => ({
  setUserType: (newType) => {
    set({ userType: newType });
  },

  setAnimal: (animal: Animal) => set({ animal }),

  setPlan: (plan: Plan) => set({ plan }),

  // social login info
  tempId: "",
  setTempId: (tempId: string) => set({ tempId }),

  provider: "",
  setProvider: (provider: string) => set({ provider }),

  socialName: "",
  setSocialName: (name: string) => set({ socialName: name }),

  profileImage: "",
  setProfileImage: (url: string) => set({ profileImage: url }),

  agreements: { term: false, privacy: false, marketing: false },
  setAgreements: (name, value) =>
    set((state) => {
      const newAgreements = { ...state.agreements, [name]: value };
      return { agreements: newAgreements };
    }),
  phoneNumber: "",
  setPhoneNumber: (phoneNumber: string) => {
    let value = phoneNumber.replace(/[^0-9]/g, ""); // 숫자만 남김

    // 010-1234-5678 형태로 자동 포맷팅
    if (value.length < 4) {
      value = value;
    } else if (value.length < 8) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11);
    }

    set({ phoneNumber: value });
  },

  email: "",
  setEmail: (email: string) => set({ email }),

  photo: null,
  setPhoto: (photo: File | null) => set({ photo }),
  photoPreview: "",
  setPhotoPreview: (preview: string) => set({ photoPreview: preview }),

  breederName: "",
  setBreederName: (name: string) => set({ breederName: name }),

  breederDescription: "",
  setBreederDescription: (description: string) =>
    set({ breederDescription: description }),

  breederLocation: "",
  setBreederLocation: (location: string | null) =>
    set({ breederLocation: location }),

  breeds: [],
  setBreeds: (breeds: string[]) => set({ breeds }),

  level: "elite",
  setLevel: (level: "elite" | "new") => set({ level }),

  nickname: "",
  setNickname: (nickname: string) => set({ nickname }),

  flowIndex: 0,
  nextFlowIndex: () =>
    set((state) => ({
      flowIndex: state.flowIndex + 1,
    })),
  prevFlowIndex: () =>
    set((state) => ({
      flowIndex: state.flowIndex - 1 < 0 ? 0 : state.flowIndex - 1,
    })),

  documents: {},
  setDocuments: (name: string, file: File | null) =>
    set((state) => ({
      documents: { ...state.documents, [name]: file },
    })),
  resetFlowIndex: () => set({ flowIndex: 0 }),
}));

export default useSignupFormStore;
