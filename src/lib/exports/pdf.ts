import type { Sector, Language } from "../types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Args { sector: Sector; language: Language; logo: string | null }

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const twoFrames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

export async function exportPDF({ sector, language }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;

  if (prevEditing) {
    useApp.setState({ isEditingMode: false });
    await twoFrames();
  }

  // Move print-root into view temporarily so html2canvas can render it
  const prevStyle = printRoot.getAttribute("style") || "";
  printRoot.style.cssText = "position: absolute; left: 0; top: 0; width: 1100px; z-index: -1; visibility: hidden;";
  await wait(500);

  try {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4", compress: true });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const sections = printRoot.querySelectorAll("[data-print-section]");

    if (sections.length === 0) {
      // Fallback: capture entire print-root as one long PDF
      const canvas = await html2canvas(printRoot, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const ratio = canvas.width / canvas.height;
      const imgHeight = pageWidth / ratio;
      let y = 0;
      let remaining = imgHeight;
      while (remaining > 0) {
        pdf.addImage(imgData, "JPEG", 0, -y, pageWidth, imgHeight);
        remaining -= pageHeight;
        y += pageHeight;
        if (remaining > 0) pdf.addPage();
      }
    } else {
      // Capture section by section for clean page breaks
      let first = true;
      for (const section of Array.from(sections)) {
        const canvas = await html2canvas(section as HTMLElement, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        if (!first) pdf.addPage();
        first = false;

        // If section is taller than one page, paginate it
        if (imgHeight <= pageHeight) {
          pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
        } else {
          let y = 0;
          let remaining = imgHeight;
          while (remaining > 0) {
            pdf.addImage(imgData, "JPEG", 0, -y, pageWidth, imgHeight);
            remaining -= pageHeight;
            y += pageHeight;
            if (remaining > 0) pdf.addPage();
          }
        }
      }
    }

    pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
  } finally {
    // Restore print-root to its hidden position
    printRoot.setAttribute("style", prevStyle);
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }
}