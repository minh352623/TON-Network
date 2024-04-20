import { create } from "zustand";

export const useUserStore = create((set) => ({
  token: "",
  setToken: (data: { token: string }) => set({ token: data.token }),
  removeToken: () => set({ token: "" }),
}));
