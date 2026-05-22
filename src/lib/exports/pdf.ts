import type { Sector, Language } from "../types";

interface Args { sector: Sector; language: Language; logo: string | null }

const twoFrames = () => new Promise<void>((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));
const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export async function exportPDF({ sector, language, logo }: Args) {
  const printRoot = document.getElementById("print-root");
  if (!printRoot) { alert("Nothing to export."); return; }

  const { useApp } = await import("../../state/store");
  const prevEditing = useApp.getState().isEditingMode;
  if (prevEditing) {
    useApp.setState({ isEditingMode: false });
    await twoFrames();
  }
  await wait(300);

  // Collect all CSS from the page
  const styles = Array.from(document.styleSheets).map(sheet => {
    try { return Array.from(sheet.cssRules).map(r => r.cssText).join("\n"); }
    catch { return ""; }
  }).join("\n");

  const content = printRoot.innerHTML;

  const printWindow = window.open("", "_blank", "width=1000,height=800");
  if (!printWindow) {
    alert("Please allow popups for this site, then try again.");
    if (prevEditing) useApp.setState({ isEditingMode: true });
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DistritoEnergetico_${sector}_${language}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    ${styles}
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { margin: 0; padding: 0; background: white; font-family: 'Manrope', sans-serif; }
    [data-print-section] { page-break-after: always; break-after: page; padding: 48px; }
  </style>
</head>
<body>${content}</body>
</html>`);

  printWindow.document.close();

  // Wait for fonts and styles to load, then print
  await wait(2000);
  printWindow.print();

  // Cleanup after print dialog
  setTimeout(() => {
    printWindow.close();
    if (prevEditing) useApp.setState({ isEditingMode: true });
  }, 1000);
}
