import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentTree, Sector, Language, CustomBlock } from "@/lib/types";
import { createDefaultContent } from "@/lib/default-content";

interface AppState {
  content: ContentTree;
  sector: Sector;
  language: Language;
  isEditingMode: boolean;
  logo: string | null;
  theme: "Monochrome" | "Industrial" | "Impact";
  setSector: (s: Sector) => void;
  setLanguage: (l: Language) => void;
  setEditingMode: (v: boolean) => void;
  setLogo: (l: string | null) => void;
  setTheme: (t: "Monochrome" | "Industrial" | "Impact") => void;
  updateTab: (tabKey: string, path: string, value: unknown) => void;
  addCustomBlock: (tabKey: string, block: CustomBlock) => void;
  updateCustomBlock: (tabKey: string, id: string, patch: Partial<CustomBlock>) => void;
  removeCustomBlock: (tabKey: string, id: string) => void;
  reorderCustomBlocks: (tabKey: string, blocks: CustomBlock[]) => void;
  replaceContent: (c: ContentTree) => void;
  resetContent: () => void;
}

function setDeep(obj: any, keys: string[], value: unknown) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      content: createDefaultContent(),
      sector: "Industrial",
      language: "ES",
      isEditingMode: false,
      logo: null,
      theme: "Monochrome",
      setSector: (sector) => set({ sector }),
      setLanguage: (language) => set({ language }),
      setEditingMode: (isEditingMode) => set({ isEditingMode }),
      setLogo: (logo) => set({ logo }),
      setTheme: (theme) => set({ theme }),
      updateTab: (tabKey, path, value) =>
        set((s) => {
          const content = structuredClone(s.content);
          const tab = content[s.sector][s.language][tabKey];
          setDeep(tab, path.split("."), value);
          return { content };
        }),
      addCustomBlock: (tabKey, block) =>
        set((s) => {
          const content = structuredClone(s.content);
          const tab = content[s.sector][s.language][tabKey];
          tab.customBlocks = [...(tab.customBlocks ?? []), block];
          return { content };
        }),
      updateCustomBlock: (tabKey, id, patch) =>
        set((s) => {
          const content = structuredClone(s.content);
          const tab = content[s.sector][s.language][tabKey];
          tab.customBlocks = (tab.customBlocks ?? []).map((b: CustomBlock) => (b.id === id ? { ...b, ...patch } as CustomBlock : b));
          return { content };
        }),
      removeCustomBlock: (tabKey, id) =>
        set((s) => {
          const content = structuredClone(s.content);
          const tab = content[s.sector][s.language][tabKey];
          tab.customBlocks = (tab.customBlocks ?? []).filter((b: CustomBlock) => b.id !== id);
          return { content };
        }),
      reorderCustomBlocks: (tabKey, blocks) =>
        set((s) => {
          const content = structuredClone(s.content);
          content[s.sector][s.language][tabKey].customBlocks = blocks;
          return { content };
        }),
      replaceContent: (content) => set({ content }),
      resetContent: () => set({ content: createDefaultContent() }),
    }),
    {
      name: "distrito-energetico-v2",
      partialize: (s) => ({
        content: s.content,
        sector: s.sector,
        language: s.language,
        logo: s.logo,
        theme: s.theme,
      }),
    }
  )
);
