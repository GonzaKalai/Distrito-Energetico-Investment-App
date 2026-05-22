import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Sector, Language } from "../types";

interface Args { sector: Sector; language: Language; logo: string | null }

/** Pull all :root CSS custom-property declarations so html2canvas can resolve them. */
function getRootCSSVars(): string {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
          parts.push(rule.style.cssText);
        }
      }
    } catch { /* cross-origin sheet — skip */ }
  }
  return parts.join(" ");
}

/** Wait for two paint frames so React has finished re-rendering. */
const twoFrames = () =>
  new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

export async function exportPDF({ sector, language, logo }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) {
    alert("Nothing to export — please wait for the page to fully load.");
    return;
  }

  // ── 1. Turn off editing mode so edit controls don't appear in the PDF ────
  // We reach into the Zustand store directly (safe outside React components).
  // Dynamic import avoids a circular-dep if store ever imports from exports/.
  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) {
    useApp.setState({ isEditingMode: false });
    await twoFrames(); // let React re-render without edit UI
  }

  // ── 2. Bring print-root into the visible viewport ─────────────────────────
  // html2canvas has a long-standing bug where elements at large negative
  // offsets (left: -9999px) are captured as blank canvases.
  const prevStyle = printRoot.getAttribute("style") ?? "";
  printRoot.style.cssText =
    "position:fixed;left:0;top:0;z-index:-9999;pointer-events:none;width:1100px;background:#ffffff;overflow:visible;";
  await twoFrames();

  // ── 3. Build the PDF ──────────────────────────────────────────────────────
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 32;

  // Cover page
  pdf.setFillColor(12, 12, 12);
  pdf.rect(0, 0, pageW, pageH, "F");
  if (logo) {
    try { pdf.addImage(logo, "PNG", margin, margin, 130, 44); } catch {}
  }
  const coverY = logo ? 130 : 90;
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(30);
  pdf.setFont("helvetica", "bold");
  pdf.text("DISTRITO ENERGÉTICO", margin, coverY);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(160, 160, 160);
  pdf.text("Vaca Muerta Investment Platform", margin, coverY + 26);
  pdf.setFontSize(10);
  pdf.text(
    `Sector: ${sector}  ·  ${language}  ·  ${new Date().toLocaleDateString()}`,
    margin,
    coverY + 48
  );

  // ── 4. Capture each visible tab section ──────────────────────────────────
  const cssVars = getRootCSSVars();
  const sections = printRoot.querySelectorAll<HTMLElement>("[data-print-section]");

  for (const section of Array.from(sections)) {
    try {
      const canvas = await html2canvas(section, {
        scale: 1.8,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (_doc, _el) => {
          // Inject resolved CSS vars so Tailwind colour utilities render correctly.
          const style = _doc.createElement("style");
          style.textContent = `:root { ${cssVars} } * { -webkit-print-color-adjust: exact !important; }`;
          _doc.head.appendChild(style);
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const ratio = canvas.width / canvas.height;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;

      pdf.addPage();
      if (availW / ratio <= availH) {
        pdf.addImage(imgData, "JPEG", margin, margin, availW, availW / ratio);
      } else {
        const w = availH * ratio;
        pdf.addImage(imgData, "JPEG", (pageW - w) / 2, margin, w, availH);
      }
    } catch (err) {
      console.error("[PDF] Failed to capture section:", err);
    }
  }

  // ── 5. Restore everything ─────────────────────────────────────────────────
  printRoot.setAttribute("style", prevStyle);
  if (prevEditing) useApp.setState({ isEditingMode: true });

  pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
}
