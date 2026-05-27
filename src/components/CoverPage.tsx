import { useApp } from "@/state/store";
import { EditableText } from "./editor/EditableText";

export function CoverPage() {
  const { profiles, activeProfileId, sector, language, logo, isEditingMode } = useApp();
  const profile = profiles.find(p => p.id === activeProfileId);
  const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div data-print-section className="rounded-3xl border border-border bg-foreground text-background overflow-hidden min-h-[400px] flex flex-col justify-between p-8 md:p-12">
      <div className="flex justify-between items-start">
        {logo
          ? <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          : <div className="text-xl font-bold tracking-tight opacity-90">Distrito Energético</div>
        }
        <div className="text-right">
          <div className="text-xs opacity-60 uppercase tracking-widest">{sector}</div>
          <div className="text-xs opacity-60 uppercase tracking-widest">{language === "ES" ? "Confidencial" : "Confidential"}</div>
        </div>
      </div>

      <div className="my-8">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-2">
          {language === "ES" ? "Oportunidad de Inversión" : "Investment Opportunity"}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
          Distrito Energético
        </h1>
        <h2 className="text-xl md:text-2xl opacity-70 font-medium">Vaca Muerta — {sector}</h2>
      </div>

      <div className="border-t border-background/20 pt-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="text-xs opacity-50 uppercase tracking-widest mb-1">
            {language === "ES" ? "Preparado para" : "Prepared for"}
          </div>
          {isEditingMode
            ? (
              <div className="text-lg font-semibold">
                <EditableText
                  value={profile?.name || "Nombre del Inversor"}
                  onSave={() => {}}
                />
                {profile?.company && (
                  <div className="text-sm opacity-70 mt-0.5">
                    <EditableText value={profile.company} onSave={() => {}} />
                  </div>
                )}
              </div>
            )
            : (
              <div className="text-lg font-semibold">
                {profile?.name || "Nombre del Inversor"}
                {profile?.company && <div className="text-sm opacity-70 mt-0.5">{profile.company}</div>}
              </div>
            )
          }
        </div>
        <div className="text-right">
          <div className="text-xs opacity-50 uppercase tracking-widest mb-1">
            {language === "ES" ? "Fecha" : "Date"}
          </div>
          <div className="text-sm font-medium opacity-80">{today}</div>
        </div>
      </div>
    </div>
  );
}
