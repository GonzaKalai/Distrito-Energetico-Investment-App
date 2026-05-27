export type Sector = "Industrial" | "Hospitality" | "Residential" | "Logistics Cluster" | "Comercial / Retail" | "Hotel" | "Truck Center";
export type Language = "ES" | "EN";
export type Theme = "Monochrome" | "Industrial" | "Impact";

export type CustomBlock =
  | { id: string; type: "heading"; visible: boolean; text: string }
  | { id: string; type: "paragraph"; visible: boolean; text: string }
  | { id: string; type: "stat"; visible: boolean; label: string; value: string }
  | { id: string; type: "split"; visible: boolean; left: string; right: string }
  | { id: string; type: "divider"; visible: boolean }
  | { id: string; type: "faq"; visible: boolean; q: string; a: string };

export interface TabData {
  title: string;
  isVisible: boolean;
  [k: string]: any;
  customBlocks?: CustomBlock[];
}

export type SectorContent = Record<string, TabData>;
export type ContentTree = Record<Sector, Record<Language, SectorContent>>;

export interface InvestorProfile {
  id: string;
  name: string;
  company: string;
  createdAt: string;
  sector: Sector;
  language: Language;
  logo: string | null;
  theme: Theme;
  content: ContentTree;
}

export interface SentEntry {
  id: string;
  profileId: string;
  investorName: string;
  company: string;
  sector: Sector;
  language: Language;
  irrAtSend: string;
  sentAt: string;
  notes: string;
}
