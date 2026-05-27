import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContentTree, Sector, Language, CustomBlock, InvestorProfile, Theme, SentEntry } from "@/lib/types";
import { createDefaultContent } from "@/lib/default-content";

let _counter = 0;
const makeId = () => `${Date.now()}-${++_counter}`;

const newProfile = (name: string, company: string): InvestorProfile => ({
  id: makeId(),
  name,
  company,
  createdAt: new Date().toISOString(),
  sector: "Industrial",
  language: "ES",
  logo: null,
  theme: "Monochrome",
  content: createDefaultContent(),
});

function setDeep(obj: any, keys: string[], value: unknown) {
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

function saveWorkingCopy(s: AppState): InvestorProfile[] {
  return s.profiles.map(p =>
    p.id === s.activeProfileId
      ? { ...p, sector: s.sector, language: s.language, logo: s.logo, theme: s.theme, content: s.content }
      : p
  );
}

interface AppState {
  profiles: InvestorProfile[];
  activeProfileId: string;
  content: ContentTree;
  sector: Sector;
  language: Language;
  isEditingMode: boolean;
  logo: string | null;
  theme: Theme;
  sentLog: SentEntry[];

  setSector: (s: Sector) => void;
  setLanguage: (l: Language) => void;
  setEditingMode: (v: boolean) => void;
  setLogo: (l: string | null) => void;
  setTheme: (t: Theme) => void;
  updateTab: (tabKey: string, path: string, value: unknown) => void;
  addCustomBlock: (tabKey: string, block: CustomBlock) => void;
  updateCustomBlock: (tabKey: string, id: string, patch: Partial<CustomBlock>) => void;
  removeCustomBlock: (tabKey: string, id: string) => void;
  reorderCustomBlocks: (tabKey: string, blocks: CustomBlock[]) => void;
  replaceContent: (c: ContentTree) => void;
  resetContent: () => void;

  createProfile: (name: string, company: string) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  duplicateProfile: (id: string) => void;
  updateProfileMeta: (name: string, company: string) => void;

  addSentEntry: (entry: Omit<SentEntry, "id">) => void;
  deleteSentEntry: (id: string) => void;
}

const initial = newProfile("General", "");

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      profiles: [initial],
      activeProfileId: initial.id,
      content: initial.content,
      sector: initial.sector,
      language: initial.language,
      isEditingMode: false,
      logo: initial.logo,
      theme: initial.theme,
      sentLog: [],

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
          tab.customBlocks = (tab.customBlocks ?? []).map((b: CustomBlock) =>
            b.id === id ? { ...b, ...patch } as CustomBlock : b
          );
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

      createProfile: (name, company) =>
        set((s) => {
          const p = newProfile(name, company);
          const profiles = [...saveWorkingCopy(s), p];
          return { profiles, activeProfileId: p.id, content: p.content, sector: p.sector, language: p.language, logo: p.logo, theme: p.theme };
        }),

      switchProfile: (id) =>
        set((s) => {
          if (id === s.activeProfileId) return {};
          const profiles = saveWorkingCopy(s);
          const target = profiles.find(p => p.id === id);
          if (!target) return {};
          return { profiles, activeProfileId: id, content: target.content, sector: target.sector, language: target.language, logo: target.logo, theme: target.theme };
        }),

      deleteProfile: (id) =>
        set((s) => {
          if (s.profiles.length <= 1) return {};
          const profiles = saveWorkingCopy(s).filter(p => p.id !== id);
          if (s.activeProfileId !== id) return { profiles };
          const next = profiles[0];
          return { profiles, activeProfileId: next.id, content: next.content, sector: next.sector, language: next.language, logo: next.logo, theme: next.theme };
        }),

      duplicateProfile: (id) =>
        set((s) => {
          const profiles = saveWorkingCopy(s);
          const src = profiles.find(p => p.id === id);
          if (!src) return {};
          const copy: InvestorProfile = { ...structuredClone(src), id: makeId(), name: `${src.name} (copia)`, createdAt: new Date().toISOString() };
          return { profiles: [...profiles, copy], activeProfileId: copy.id, content: copy.content, sector: copy.sector, language: copy.language, logo: copy.logo, theme: copy.theme };
        }),

      updateProfileMeta: (name, company) =>
        set((s) => ({ profiles: s.profiles.map(p => p.id === s.activeProfileId ? { ...p, name, company } : p) })),

      addSentEntry: (entry) =>
        set((s) => ({ sentLog: [{ ...entry, id: makeId() }, ...s.sentLog] })),

      deleteSentEntry: (id) =>
        set((s) => ({ sentLog: s.sentLog.filter(e => e.id !== id) })),
    }),
    {
      name: "distrito-energetico-v3",
      partialize: (s) => ({
        profiles: s.profiles,
        activeProfileId: s.activeProfileId,
        content: s.content,
        sector: s.sector,
        language: s.language,
        logo: s.logo,
        theme: s.theme,
        sentLog: s.sentLog,
      }),
    }
  )
);
