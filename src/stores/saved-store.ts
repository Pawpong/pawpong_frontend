import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedStore {
  savedBreederIds: string[];
  addToSaved: (id: string) => void;
  removeFromSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedBreederIds: [],

      addToSaved: (id) => {
        set((state) => ({
          savedBreederIds: [...state.savedBreederIds, id],
        }));
      },

      removeFromSaved: (id) => {
        set((state) => ({
          savedBreederIds: state.savedBreederIds.filter(
            (savedId) => savedId !== id
          ),
        }));
      },

      isSaved: (id) => {
        return get().savedBreederIds.includes(id);
      },

      toggleSaved: (id) => {
        const { isSaved, addToSaved, removeFromSaved } = get();
        if (isSaved(id)) {
          removeFromSaved(id);
        } else {
          addToSaved(id);
        }
      },
    }),
    {
      name: "saved-breeders-storage",
    }
  )
);
