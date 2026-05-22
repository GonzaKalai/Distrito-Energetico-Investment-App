import type { Sector, Language } from "../types";

interface Args { sector: Sector; language: Language; logo: string | null }

const twoFrames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

export async function exportPDF({ sector, language, logo }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) {
    useApp.setState({ isEditingMode: false });
    await twoFrames();
  }

  const prevTitle = document.title;
  document.title = `DistritoEnergetico_${sector}_${language}`;

  const style = document.createElement("style");
  style.id = "pdf-print-style";
  style.textContent = `
    @media print {
      @page { margin: 1cm; size: A4; }
      body * { visibility: hidden !important; }
      #print-root { visibility: visible !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; background: white !important; }
      #print-root * { visibility: visible !important; }
      [data-print-section] { page-break-after: always; break-after: page; padding: 1.5cm; }
    }
  `;
  document.head.appendChild(style);
  await twoFrames();

  window.print();

  setTimeout(() => {
    document.title = prevTitle;
    document.getElementById("pdf-print-style")?.remove();
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }, 3000);
}
