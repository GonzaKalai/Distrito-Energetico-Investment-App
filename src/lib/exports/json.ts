import type { ContentTree, Sector, Language } from "../types";

const REQUIRED_SECTORS: Sector[] = ["Industrial", "Hospitality", "Residential", "Logistics Cluster"];
const REQUIRED_LANGUAGES: Language[] = ["ES", "EN"];

export function exportJSON(content: ContentTree) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `distrito-energetico-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  // Defer revoke so the browser has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

export function importJSON(file: File): Promise<ContentTree> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const c = JSON.parse(r.result as string) as ContentTree;
        // Validate all required sectors and languages are present.
        for (const sector of REQUIRED_SECTORS) {
          if (!c[sector]) throw new Error(`Missing sector: ${sector}`);
          for (const lang of REQUIRED_LANGUAGES) {
            if (!c[sector][lang]) throw new Error(`Missing language ${lang} in sector ${sector}`);
          }
        }
        resolve(c);
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Invalid JSON file"));
      }
    };
    r.onerror = () => reject(new Error("Failed to read file"));
    r.readAsText(file);
  });
}
