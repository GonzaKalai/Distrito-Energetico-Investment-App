import PptxGenJS from "pptxgenjs";
import type { ContentTree, Sector, Language, CustomBlock } from "../types";
import { TAB_KEYS } from "../default-content";

interface Args { content: ContentTree; sector: Sector; language: Language; logo: string | null }

function collectText(node: any, lines: string[]) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) { node.forEach((n) => collectText(n, lines)); return; }
  if (node.isVisible === false) return;
  if (node.title && typeof node.title === "string") lines.push(`■ ${node.title}`);
  if (node.text && typeof node.text === "string") lines.push(node.text);
  if (node.desc && typeof node.desc === "string") lines.push(node.desc);
  if (node.details && typeof node.details === "string") lines.push(node.details);
  if (node.q && node.a) lines.push(`Q: ${node.q}\nA: ${node.a}`);
  if (node.t && node.d) lines.push(`• ${node.t}: ${node.d}`);
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (v && typeof v === "object" && !["title", "text", "desc", "details", "q", "a", "t", "d"].includes(k)) {
      collectText(v, lines);
    }
  }
}

function customBlockText(blocks: CustomBlock[] | undefined): string[] {
  if (!blocks) return [];
  return blocks
    .filter((b) => b.visible)
    .map((b) => {
      switch (b.type) {
        case "heading": return `■ ${b.text}`;
        case "paragraph": return b.text;
        case "stat": return `${b.label}: ${b.value}`;
        case "split": return `${b.left}\n\n${b.right}`;
        case "faq": return `Q: ${b.q}\nA: ${b.a}`;
        case "divider": return "---";
      }
    });
}

export async function exportPPTX({ content, sector, language, logo }: Args) {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  const tree = content[sector][language];

  // Cover
  const cover = pres.addSlide();
  cover.background = { color: "0F172A" };
  if (logo) {
    try { cover.addImage({ data: logo, x: 0.5, y: 0.5, w: 1.8, h: 0.7, sizing: { type: "contain", w: 1.8, h: 0.7 } }); } catch {}
  }
  cover.addText("DISTRITO ENERGÉTICO", { x: 0.5, y: 2.0, w: 9, fontSize: 44, bold: true, color: "FFFFFF" });
  cover.addText("Investment Memorandum", { x: 0.5, y: 3.0, w: 9, fontSize: 22, color: "CBD5E1" });
  cover.addText(`${sector}  •  ${language}  •  ${new Date().toLocaleDateString()}`, { x: 0.5, y: 4.2, w: 9, fontSize: 14, color: "94A3B8" });

  // Per tab
  for (const key of TAB_KEYS) {
    const tab = tree[key];
    if (!tab.isVisible) continue;
    const slide = pres.addSlide();
    slide.background = { color: "FFFFFF" };
    slide.addText(tab.title.toUpperCase(), { x: 0.5, y: 0.4, w: 9, fontSize: 26, bold: true, color: "0F172A" });
    slide.addShape("line", { x: 0.5, y: 0.95, w: 9, h: 0, line: { color: "E2E8F0", width: 1.5 } });

    const lines: string[] = [];
    for (const k of Object.keys(tab)) {
      if (["title", "isVisible", "customBlocks"].includes(k)) continue;
      collectText(tab[k], lines);
    }
    lines.push(...customBlockText(tab.customBlocks));
    const body = lines.join("\n\n");
    slide.addText(body || "—", { x: 0.5, y: 1.1, w: 9, h: 4.2, fontSize: 12, color: "334155", valign: "top" });
  }

  await pres.writeFile({ fileName: `DistritoEnergetico_${sector}_${language}.pptx` });
}
