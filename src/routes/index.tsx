import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { TabNav } from "@/components/TabNav";
import { TAB_COMPONENTS } from "@/components/tabs";
import { CoverPage } from "@/components/CoverPage";
import { useApp } from "@/state/store";
import { TAB_KEYS } from "@/lib/default-content";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [activeTab, setActiveTab] = useState("tab2");
  const { content, sector, language, isEditingMode, logo, theme } = useApp();
  const Active = TAB_COMPONENTS[activeTab] ?? TAB_COMPONENTS.tab1;
  const themeClass =
    theme === "Industrial" ? "theme-industrial" : theme === "Impact" ? "theme-impact" : "";

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans ${themeClass}`}>
      <Toolbar />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <header className="bg-card border border-border rounded-3xl p-6 md:p-8 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            {logo ? (
              <img src={logo} alt="Logo" className="h-16 object-contain mb-4" />
            ) : (
              <div className="h-14 w-44 bg-accent border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-sm mb-4">Upload logo →</div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Distrito Energético</h1>
            <p className="text-muted-foreground mt-1">Vaca Muerta Investment Platform · <span className="text-primary font-semibold">{sector}</span> · {language}</p>
          </div>
        </header>

        <CoverPage />
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="animate-in fade-in duration-300">
          <Active />
        </div>

        {/* Hidden render of all visible tabs for PDF export. */}
        <div id="print-root" className="absolute -left-[9999px] top-0 w-[1100px] bg-background">
          <div data-print-section className="p-8 bg-foreground text-background">
            <CoverPage />
          </div>
          {TAB_KEYS.map((k) => {
            const tab = content[sector][language][k];
            if (!tab.isVisible) return null;
            const C = TAB_COMPONENTS[k];
            return (
              <div key={k} data-print-section className="p-8 bg-background">
                <h2 className="text-3xl font-extrabold mb-6">{tab.title}</h2>
                <PrintProxy>
                  <C />
                </PrintProxy>
              </div>
            );
          })}
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          {isEditingMode ? "Edit mode · click any text to edit · toggle sections with the Visible/Hidden pill" : "Presentation mode"}
        </footer>
      </main>
    </div>
  );
}

// Force editing mode off inside the print tree so it renders the clean view.
function PrintProxy({ children }: { children: React.ReactNode }) {
  // Render children using a CSS-only "presentation" effect. The PDF capture
  // grabs DOM, so we wrap to hide edit affordances visually.
  return <div className="[&_button[title='Drag']]:hidden [&_[data-editonly]]:hidden">{children}</div>;
}
