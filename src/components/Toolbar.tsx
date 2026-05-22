import { Download, Edit3, FileBox, Image as ImageIcon, Presentation, RefreshCw, Upload, Eraser } from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "@/state/store";
import { SECTORS_LIST, LANGUAGES_LIST } from "@/lib/default-content";
import { exportPDF } from "@/lib/exports/pdf";
import { exportPPTX } from "@/lib/exports/pptx";
import { exportJSON, importJSON } from "@/lib/exports/json";
import type { Sector, Language } from "@/lib/types";

const THEMES = ["Monochrome", "Industrial", "Impact"] as const;

export function Toolbar() {
  const { isEditingMode, language, sector, logo, theme, setEditingMode, setLanguage, setSector, setLogo, setTheme, replaceContent, resetContent, content } = useApp();
  const [busy, setBusy] = useState<null | "pdf" | "pptx">(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const jsonRef = useRef<HTMLInputElement>(null);

  const onLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setLogo(r.result as string);
    r.readAsDataURL(f);
  };

  const onPDF = async () => {
    setBusy("pdf");
    try { await exportPDF({ sector, language, logo }); } catch (e) { console.error(e); alert("PDF export failed"); }
    setBusy(null);
  };
  const onPPTX = async () => {
    setBusy("pptx");
    try { await exportPPTX({ content, sector, language, logo }); } catch (e) { console.error(e); alert("PPTX export failed"); }
    setBusy(null);
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const c = await importJSON(f);
      replaceContent(c);
      alert("Imported successfully");
    } catch { alert("Invalid JSON file"); }
  };

  return (
    <div className="sticky top-0 z-40 bg-foreground text-background border-b border-border shadow-md">
      <div className="max-w-[1400px] mx-auto flex flex-wrap gap-3 items-center px-4 py-3 text-sm">
        <div className="mr-2 leading-tight">
          <div className="font-bold tracking-tight">Distrito Energético</div>
          <div className="text-[10px] opacity-70 uppercase tracking-wider">Vaca Muerta Investment Platform</div>
        </div>

        <div className="flex bg-background/10 rounded-lg p-1">
          {LANGUAGES_LIST.map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l as Language)}
              className={`px-3 py-1 rounded-md font-bold transition-colors ${language === l ? "bg-background text-foreground" : "opacity-70 hover:opacity-100"}`}
            >
              {l}
            </button>
          ))}
        </div>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as typeof THEMES[number])}
          className="bg-background/10 border-0 rounded-lg px-3 py-1.5 font-medium cursor-pointer"
          title="Visual theme"
        >
          {THEMES.map((t) => <option key={t} value={t} className="text-foreground">{t}</option>)}
        </select>

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value as Sector)}
          className="bg-background/10 border-0 rounded-lg px-3 py-1.5 font-medium cursor-pointer"
        >
          {SECTORS_LIST.map((s) => <option key={s} value={s} className="text-foreground">{s}</option>)}
        </select>

        <label className="cursor-pointer bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
          <ImageIcon size={14} /> Logo
          <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={onLogo} />
        </label>
        {logo && <img src={logo} alt="logo" className="h-7 w-auto rounded bg-background/20 p-0.5" />}

        <div className="flex-1" />

        <button onClick={onPPTX} disabled={busy === "pptx"} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          {busy === "pptx" ? <RefreshCw size={14} className="animate-spin" /> : <Presentation size={14} />} PPTX
        </button>
        <button onClick={onPDF} disabled={busy === "pdf"} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          {busy === "pdf" ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} PDF
        </button>
        <button onClick={() => exportJSON(content)} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium" title="Backup all content">
          <FileBox size={14} /> JSON
        </button>
        <label className="cursor-pointer bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          <Upload size={14} /> Import
          <input ref={jsonRef} type="file" className="hidden" accept="application/json" onChange={onImport} />
        </label>
        <button
          onClick={() => { if (confirm("Reset ALL content to defaults? Your edits will be lost.")) resetContent(); }}
          className="bg-background/10 hover:bg-destructive/80 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium"
          title="Reset content"
        >
          <Eraser size={14} />
        </button>

        <button
          onClick={() => setEditingMode(!isEditingMode)}
          className={`px-4 py-1.5 rounded-lg flex items-center gap-2 font-bold transition-colors ${
            isEditingMode ? "bg-primary text-primary-foreground" : "bg-background text-foreground"
          }`}
        >
          {isEditingMode ? <><Presentation size={14} /> Present</> : <><Edit3 size={14} /> Edit</>}
        </button>
      </div>
    </div>
  );
}
