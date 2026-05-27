import {
  ChevronDown, Copy, Download, Edit3, Eraser, FileBox,
  Image as ImageIcon, Plus, Presentation, RefreshCw,
  Trash2, Upload, Users, X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "@/state/store";
import { SECTORS_LIST, LANGUAGES_LIST } from "@/lib/default-content";
import { exportPDF } from "@/lib/exports/pdf";
import { exportPPTX } from "@/lib/exports/pptx";
import { exportJSON, importJSON } from "@/lib/exports/json";
import type { Sector, Language } from "@/lib/types";
import { SendLogButton } from "./SendLog";

const THEMES = ["Monochrome", "Industrial", "Impact"] as const;

function ProfileSwitcher() {
  const {
    profiles, activeProfileId,
    createProfile, switchProfile, deleteProfile, duplicateProfile, updateProfileMeta,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCompany, setNewCompany] = useState("");

  const active = profiles.find((p) => p.id === activeProfileId);

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProfile(newName.trim(), newCompany.trim());
    setNewName(""); setNewCompany(""); setCreating(false); setOpen(false);
  };

  const handleUpdateMeta = () => {
    updateProfileMeta(newName.trim() || active?.name || "", newCompany.trim());
    setEditing(false);
  };

  const startEdit = () => {
    setNewName(active?.name || "");
    setNewCompany(active?.company || "");
    setEditing(true);
    setCreating(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => { setOpen(!open); setCreating(false); setEditing(false); }}
        className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium max-w-[220px]"
      >
        <Users size={14} />
        <span className="truncate text-sm">{active?.name || "Sin nombre"}</span>
        {active?.company && (
          <span className="opacity-60 text-xs truncate hidden sm:inline">· {active.company}</span>
        )}
        <ChevronDown size={12} className="flex-shrink-0" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-xl shadow-xl z-50 w-72 overflow-hidden">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Memos de inversores</span>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-accent rounded">
                <X size={14} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg group cursor-pointer ${
                    p.id === activeProfileId ? "bg-foreground text-background" : "hover:bg-accent"
                  }`}
                >
                  <div
                    className="flex-1 min-w-0"
                    onClick={() => { switchProfile(p.id); setOpen(false); }}
                  >
                    <div className="font-medium text-sm truncate">{p.name}</div>
                    {p.company && (
                      <div className={`text-xs truncate ${p.id === activeProfileId ? "opacity-70" : "text-muted-foreground"}`}>
                        {p.company}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateProfile(p.id); setOpen(false); }}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      p.id === activeProfileId ? "hover:bg-background/20" : "hover:bg-accent"
                    }`}
                    title="Duplicar"
                  >
                    <Copy size={12} />
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Eliminar "${p.name}"?`)) deleteProfile(p.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-border p-2 space-y-1">
              {!creating && !editing && (
                <>
                  <button
                    onClick={startEdit}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm"
                  >
                    <Edit3 size={13} /> Renombrar memo actual
                  </button>
                  <button
                    onClick={() => { setCreating(true); setEditing(false); setNewName(""); setNewCompany(""); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent text-sm font-medium"
                  >
                    <Plus size={13} /> Nuevo memo de inversor
                  </button>
                </>
              )}

              {(creating || editing) && (
                <div className="space-y-2 px-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {creating ? "Nuevo memo" : "Renombrar"}
                  </div>
                  <input
                    autoFocus
                    placeholder="Nombre del inversor"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (creating ? handleCreate() : handleUpdateMeta())}
                    className="w-full text-sm px-2 py-1.5 rounded-lg border border-border bg-background text-foreground"
                  />
                  <input
                    placeholder="Empresa (opcional)"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (creating ? handleCreate() : handleUpdateMeta())}
                    className="w-full text-sm px-2 py-1.5 rounded-lg border border-border bg-background text-foreground"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={creating ? handleCreate : handleUpdateMeta}
                      className="flex-1 text-sm px-3 py-1.5 bg-foreground text-background rounded-lg font-medium"
                    >
                      {creating ? "Crear" : "Guardar"}
                    </button>
                    <button
                      onClick={() => { setCreating(false); setEditing(false); }}
                      className="px-3 py-1.5 rounded-lg hover:bg-accent text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Toolbar() {
  const {
    isEditingMode, language, sector, logo, theme,
    setEditingMode, setLanguage, setSector, setLogo, setTheme,
    replaceContent, resetContent, content,
  } = useApp();
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
      alert("Importado correctamente");
    } catch { alert("Archivo JSON inválido"); }
  };

  return (
    <div className="sticky top-0 z-40 bg-foreground text-background border-b border-border shadow-md">
      <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 items-center px-4 py-3 text-sm">
        <div className="mr-2 leading-tight flex-shrink-0">
          <div className="font-bold tracking-tight">Distrito Energético</div>
          <div className="text-[10px] opacity-70 uppercase tracking-wider">Investment Platform</div>
        </div>

        <ProfileSwitcher />

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
          title="Tema visual"
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

        <SendLogButton />
        <button onClick={onPPTX} disabled={busy === "pptx"} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          {busy === "pptx" ? <RefreshCw size={14} className="animate-spin" /> : <Presentation size={14} />} PPTX
        </button>
        <button onClick={onPDF} disabled={busy === "pdf"} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          {busy === "pdf" ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />} PDF
        </button>
        <button onClick={() => exportJSON(content)} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium" title="Backup">
          <FileBox size={14} /> JSON
        </button>
        <label className="cursor-pointer bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium">
          <Upload size={14} /> Import
          <input ref={jsonRef} type="file" className="hidden" accept="application/json" onChange={onImport} />
        </label>
        <button
          onClick={() => { if (confirm("¿Resetear contenido a valores por defecto?")) resetContent(); }}
          className="bg-background/10 hover:bg-destructive/80 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium"
          title="Reset"
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
