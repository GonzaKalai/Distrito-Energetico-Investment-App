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

  // Suggest filename via document title
  const prevTitle = document.title;
  document.title = `DistritoEnergetico_${sector}_${language}`;

  // Bring print-root on screen
  const prevStyle = printRoot.getAttribute("style") ?? "";
  printRoot.style.cssText = "position:fixed;left:0;top:0;width:100%;z-index:99999;background:#fff;overflow:visible;";

  // Inject print CSS — hide everything except print-root
  const style = document.createElement("style");
  style.id = "pdf-print-style";
  style.textContent = `
    @media print {
      @page { margin: 1.5cm; }
      body > *:not(#print-root) { display: none !important; }
      #print-root {
        position: static !important;
        width: 100% !important;
        display: block !important;
      }
      [data-print-section] {
        page-break-after: always;
        break-after: page;
      }
    }
  `;
  document.head.appendChild(style);
  await twoFrames();

  window.print();

  // Cleanup after print dialog closes
  setTimeout(() => {
    document.title = prevTitle;
    printRoot.setAttribute("style", prevStyle);
    document.getElementById("pdf-print-style")?.remove();
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }, 2000);
}
