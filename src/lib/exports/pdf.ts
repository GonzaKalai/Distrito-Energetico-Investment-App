import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Sector, Language } from "../types";

interface Args { sector: Sector; language: Language; logo: string | null }

function getRootCSSVars(): string {
  const parts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText === ":root") {
          parts.push(rule.style.cssText);
        }
      }
    } catch {}
  }
  return parts.join(" ");
}

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
const twoFrames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

async function captureElement(el: HTMLElement, cssVars: string): Promise<string> {
  const canvas = await html2canvas(el, {
    scale: 1.8,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
    allowTaint: true,
    onclone: (_doc) => {
      const style = _doc.createElement("style");
      style.textContent = `:root { ${cssVars} } * { -webkit-print-color-adjust: exact !important; }`;
      _doc.head.appendChild(style);
    },
  });
  return canvas.toDataURL("image/jpeg", 0.92);
}

function addImagePage(pdf: jsPDF, imgData: string, canvasW: number, canvasH: number) {
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 32;
  const ratio = canvasW / canvasH;
  const availW = pageW - margin * 2;
  const availH = pageH - margin * 2;
  pdf.addPage();
  if (availW / ratio <= availH) {
    pdf.addImage(imgData, "JPEG", margin, margin, availW, availW / ratio);
  } else {
    const w = availH * ratio;
    pdf.addImage(imgData, "JPEG", (pageW - w) / 2, margin, w, availH);
  }
}

export async function exportPDF({ sector, language, logo }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) {
    alert("Nothing to export — please wait for the page to fully load.");
    return;
  }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) {
    useApp.setState({ isEditingMode: false });
    await twoFrames();
  }

  // Build an HTML cover page so Montserrat renders naturally
  const cover = document.createElement("div");
  cover.style.cssText =
    "position:fixed;left:0;top:0;z-index:-9998;width:794px;height:1123px;background:#0c0c0c;display:flex;flex-direction:column;justify-content:center;padding:64px;box-sizing:border-box;font-family:'Montserrat',sans-serif;";
  cover.innerHTML = `
    ${logo ? `<img src="${logo}" style="height:48px;object-fit:contain;margin-bottom:48px;align-self:flex-start;" />` : ""}
    <div style="font-size:42px;font-weight:900;color:#ffffff;letter-spacing:-1px;line-height:1.1;margin-bottom:16px;">DISTRITO ENERGÉTICO</div>
    <div style="font-size:16px;font-weight:600;color:#a0a0a0;margin-bottom:12px;">Vaca Muerta Investment Platform</div>
    <div style="font-size:12px;color:#606060;">Sector: ${sector} &nbsp;·&nbsp; ${language} &nbsp;·&nbsp; ${new Date().toLocaleDateString()}</div>
  `;
  document.body.appendChild(cover);
  await wait(400);

  const cssVars = getRootCSSVars();
  const coverCanvas = await html2canvas(cover, {
    scale: 1.8,
    backgroundColor: "#0c0c0c",
    logging: false,
    useCORS: true,
    allowTaint: true,
    onclone: (_doc) => {
      const style = _doc.createElement("style");
      style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap'); :root { ${cssVars} }`;
      _doc.head.appendChild(style);
    },
  });
  document.body.removeChild(cover);

  // Move print-root on screen
  const prevStyle = printRoot.getAttribute("style") ?? "";
  printRoot.style.cssText =
    "position:fixed;left:0;top:0;z-index:-9999;pointer-events:none;width:1100px;background:#ffffff;overflow:visible;";
  await wait(800);

  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

  // Cover page (first page, no addPage needed)
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  pdf.addImage(coverCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pageW, pageH);

  // Content sections
  const sections = Array.from(printRoot.querySelectorAll<HTMLElement>("[data-print-section]"));
  const targets: HTMLElement[] = sections.length > 0 ? sections : [printRoot];

  for (const target of targets) {
    try {
      const canvas = await html2canvas(target, {
        scale: 1.8,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (_doc) => {
          const style = _doc.createElement("style");
          style.textContent = `:root { ${cssVars} } * { -webkit-print-color-adjust: exact !important; }`;
          _doc.head.appendChild(style);
        },
      });
      addImagePage(pdf, canvas.toDataURL("image/jpeg", 0.92), canvas.width, canvas.height);
    } catch (err) {
      console.error("[PDF] Capture failed:", err);
    }
  }

  printRoot.setAttribute("style", prevStyle);
  if (prevEditing) useApp.setState({ isEditingMode: true });
  pdf.save(`DistritoEnergetico_${sector}_${language}.pdf`);
}
