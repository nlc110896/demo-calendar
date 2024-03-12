import { create } from "zustand";
import { data, mockEventList } from "./mockData";

interface UseStore {
  data: any;
  externalList: any;
  setData: (v: any) => void;
  setExternalList: (v: any) => void;
}

const useStore = create<UseStore>((set) => ({
  data,
  externalList: mockEventList,
  setData: (v: any) => set((state) => ({ ...state, data: v })),
  setExternalList: (v: any) => set((state) => ({ ...state, externalList: v })),
}));

export default useStore;
