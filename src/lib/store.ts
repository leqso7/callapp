import { create } from 'zustand';

interface UserState {
  calories: number;
  steps: number;
  weight: number;
  targetWeight: number;
  setCalories: (calories: number) => void;
  setSteps: (steps: number) => void;
  setWeight: (weight: number) => void;
  setTargetWeight: (targetWeight: number) => void;
}

export const useStore = create<UserState>((set) => ({
  calories: 0,
  steps: 0,
  weight: 0,
  targetWeight: 0,
  setCalories: (calories) => set({ calories }),
  setSteps: (steps) => set({ steps }),
  setWeight: (weight) => set({ weight }),
  setTargetWeight: (targetWeight) => set({ targetWeight }),
})); 