export type Sector = "Industrial" | "Hospitality" | "Residential" | "Logistics Cluster";
export type Language = "ES" | "EN";

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
  // Each tab has free-form content shape; we extend via index signature.
  // The shape mirrors the Gemini prototype.
  [k: string]: any;
  customBlocks?: CustomBlock[];
}

export type SectorContent = Record<string, TabData>; // tab1..tab10
export type ContentTree = Record<Sector, Record<Language, SectorContent>>;
