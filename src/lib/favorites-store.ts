"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FavoritesState = {
  ids: string[];
  hydrated: boolean;
  setHydrated: () => void;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "uchina-map.favorites.v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
