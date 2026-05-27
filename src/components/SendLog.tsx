import { useState } from "react";
import { useApp } from "@/state/store";
import { Send, Trash2, X, Clock } from "lucide-react";
import type { Sector, Language } from "@/lib/types";

export function SendLogButton() {
  const { profiles, activeProfileId, sector, language, sentLog, addSentEntry, deleteSentEntry } = useApp();
  const profile = profiles.find(p => p.id === activeProfileId);
  const [view, setView] = useState<"closed" | "log" | "form">("closed");
  const [notes, setNotes] = useState("");
  const [irrAtSend, setIrrAtSend] = useState("");

  const handleSend = () => {
    addSentEntry({
      profileId: activeProfileId,
      investorName: profile?.name || "",
      company: profile?.company || "",
      sector,
      language,
      irrAtSend: irrAtSend || "—",
      sentAt: new Date().toISOString(),
      notes,
    });
    setNotes("");
    setIrrAtSend("");
    setView("log");
  };

  if (view === "closed") {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => setView("form")}
          className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm"
          title="Registrar envío"
        >
          <Send size={14} /> Enviar
        </button>
        {sentLog.length > 0 && (
          <button
            onClick={() => setView("log")}
            className="bg-background/10 hover:bg-background/20 px-2 py-1.5 rounded-lg flex items-center gap-1 font-medium text-sm"
            title="Ver historial"
          >
            <Clock size={14} />
            <span className="text-xs">{sentLog.length}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setView("closed")}>
        <div className="bg-background text-foreground rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex gap-2">
              <button onClick={() => setView("form")} className={`px-3 py-1 rounded-lg text-sm font-medium ${view === "form" ? "bg-foreground text-background" : "hover:bg-accent"}`}>
                Registrar envío
              </button>
              <button onClick={() => setView("log")} className={`px-3 py-1 rounded-lg text-sm font-medium ${view === "log" ? "bg-foreground text-background" : "hover:bg-accent"}`}>
                Historial ({sentLog.length})
              </button>
            </div>
            <button onClick={() => setView("closed")} className="p-1 hover:bg-accent rounded-lg"><X size={16} /></button>
          </div>

          {view === "form" && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground mb-1">Inversor</div><div className="font-medium">{profile?.name || "—"}</div></div>
                <div><div className="text-xs text-muted-foreground mb-1">Empresa</div><div className="font-medium">{profile?.company || "—"}</div></div>
                <div><div className="text-xs text-muted-foreground mb-1">Sector</div><div className="font-medium">{sector}</div></div>
                <div><div className="text-xs text-muted-foreground mb-1">Idioma</div><div className="font-medium">{language}</div></div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block mb-1">IRR al momento del envío</label>
                <input value={irrAtSend} onChange={e => setIrrAtSend(e.target.value)} placeholder="ej. 17.5%" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-semibold block mb-1">Notas</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Contexto del envío, próximos pasos, etc." rows={3} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background resize-none" />
              </div>
              <button onClick={handleSend} className="w-full bg-foreground text-background rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2">
                <Send size={14} /> Registrar envío
              </button>
            </div>
          )}

          {view === "log" && (
            <div className="p-5">
              {sentLog.length === 0
                ? <p className="text-sm text-muted-foreground text-center py-6">Todavía no registraste ningún envío.</p>
                : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {sentLog.map(e => (
                      <div key={e.id} className="border border-border rounded-xl p-3 flex gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{e.investorName}</span>
                            {e.company && <span className="text-xs text-muted-foreground">{e.company}</span>}
                            <span className="text-xs bg-accent px-2 py-0.5 rounded-full">{e.sector}</span>
                            <span className="text-xs bg-accent px-2 py-0.5 rounded-full">{e.language}</span>
                            {e.irrAtSend && e.irrAtSend !== "—" && <span className="text-xs text-emerald-600 font-semibold">IRR {e.irrAtSend}</span>}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(e.sentAt).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" })}</div>
                          {e.notes && <div className="text-xs mt-1 text-muted-foreground">{e.notes}</div>}
                        </div>
                        <button onClick={() => deleteSentEntry(e.id)} className="shrink-0 p-1 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          )}
        </div>
      </div>

      {/* Trigger button still visible */}
      <div className="flex gap-1">
        <button onClick={() => setView("form")} className="bg-background/10 hover:bg-background/20 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium text-sm">
          <Send size={14} /> Enviar
        </button>
        {sentLog.length > 0 && (
          <button onClick={() => setView("log")} className="bg-background/10 hover:bg-background/20 px-2 py-1.5 rounded-lg flex items-center gap-1 font-medium text-sm">
            <Clock size={14} /><span className="text-xs">{sentLog.length}</span>
          </button>
        )}
      </div>
    </>
  );
}
