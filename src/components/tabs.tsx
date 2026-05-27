import { FileText, Zap, TrendingUp, Map, Truck, Shield, Calculator, Building, FileBox, Info, Train, Plane, Warehouse, Check, X } from "lucide-react";
import { FinancialCalculator } from "./FinancialCalculator";
import { CoverPage } from "./CoverPage";
import { useState } from "react";
import { useApp } from "@/state/store";
import { EditableText } from "./editor/EditableText";
import { SectionWrap, VisibilityToggle } from "./editor/Toggle";
import { CustomBlocks } from "./editor/CustomBlocks";

const Card = ({ children, dark = false, className = "" }: { children: React.ReactNode; dark?: boolean; className?: string }) => (
  <div className={`rounded-3xl border p-6 md:p-8 ${dark ? "bg-foreground text-background border-foreground/20" : "bg-card text-card-foreground border-border"} ${className}`}>
    {children}
  </div>
);

// ---------- TAB 1 ----------
export function Tab1() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab1;
  return (
    <div data-print-section className="space-y-6">
      <SectionWrap isVisible={t.execSummary.isVisible} onToggle={() => updateTab("tab1", "execSummary.isVisible", !t.execSummary.isVisible)} label="Exec Summary">
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FileText className="text-primary" /><EditableText value={t.execSummary.title} onSave={(v) => updateTab("tab1", "execSummary.title", v)} /></h2>
          <div className="text-base md:text-lg leading-relaxed text-muted-foreground"><EditableText multiline value={t.execSummary.text} onSave={(v) => updateTab("tab1", "execSummary.text", v)} /></div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={t.thesis.isVisible} onToggle={() => updateTab("tab1", "thesis.isVisible", !t.thesis.isVisible)} label="Thesis">
        <Card dark>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Zap className="text-yellow-400" /><EditableText value={t.thesis.title} onSave={(v) => updateTab("tab1", "thesis.title", v)} /></h2>
          <div className="text-base md:text-lg leading-relaxed opacity-90"><EditableText multiline value={t.thesis.text} onSave={(v) => updateTab("tab1", "thesis.text", v)} /></div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab1" />
    </div>
  );
}

// ---------- TAB 2 ----------
export function Tab2() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab2;
  const [exitMode, setExitMode] = useState<"Rental" | "Sale">("Rental");
  const [selected, setSelected] = useState("turnkey");

  return (
    <div data-print-section className="space-y-6">
      <SectionWrap isVisible={t.packages.isVisible} onToggle={() => updateTab("tab2", "packages.isVisible", !t.packages.isVisible)} label="Packages">
        <Card>
          <h2 className="text-2xl font-bold mb-6"><EditableText value={t.packages.title} onSave={(v) => updateTab("tab2", "packages.title", v)} /></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(t.packages.items).map(([key, pkgRaw]) => {
              const pkg = pkgRaw as any;
              if (!pkg.isVisible && !isEditingMode) return null;
              return (
                <div key={key} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selected === key ? "border-foreground bg-accent/30" : "border-border hover:border-foreground/40"} ${!pkg.isVisible ? "opacity-40 grayscale" : ""}`} onClick={() => setSelected(key)}>
                  {isEditingMode && (
                    <div className="absolute top-2 right-2">
                      <VisibilityToggle isVisible={pkg.isVisible} onToggle={() => updateTab("tab2", `packages.items.${key}.isVisible`, !pkg.isVisible)} />
                    </div>
                  )}
                  <h4 className="font-bold text-lg mb-1"><EditableText value={pkg.name} onSave={(v) => updateTab("tab2", `packages.items.${key}.name`, v)} /></h4>
                  <div className="text-xs font-semibold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded mb-3"><EditableText value={pkg.multiplier} onSave={(v) => updateTab("tab2", `packages.items.${key}.multiplier`, v)} /></div>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[3rem]"><EditableText multiline value={pkg.desc} onSave={(v) => updateTab("tab2", `packages.items.${key}.desc`, v)} /></p>
                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Ownership</div>
                    <div className="text-foreground"><EditableText value={pkg.ownership} onSave={(v) => updateTab("tab2", `packages.items.${key}.ownership`, v)} /></div>
                    <div className="flex gap-2 text-muted-foreground"><Check size={14} className="text-emerald-500 shrink-0 mt-1" /><EditableText multiline value={pkg.includes} onSave={(v) => updateTab("tab2", `packages.items.${key}.includes`, v)} /></div>
                    <div className="flex gap-2 text-muted-foreground"><X size={14} className="text-rose-400 shrink-0 mt-1" /><EditableText multiline value={pkg.excludes} onSave={(v) => updateTab("tab2", `packages.items.${key}.excludes`, v)} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.dashboard.isVisible} onToggle={() => updateTab("tab2", "dashboard.isVisible", !t.dashboard.isVisible)} label="Dashboard">
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
            <h2 className="text-2xl font-bold flex items-center gap-3"><TrendingUp className="text-primary" /><EditableText value={t.dashboard.title} onSave={(v) => updateTab("tab2", "dashboard.title", v)} /></h2>
            <div className="flex bg-accent p-1 rounded-xl">
              {(["Rental", "Sale"] as const).map((m) => (
                <button key={m} onClick={() => setExitMode(m)} className={`px-4 py-1.5 rounded-lg text-sm font-bold ${exitMode === m ? "bg-background shadow" : "opacity-60"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCell label="Entry" value={t.dashboard.entryTicket} onSave={(v) => updateTab("tab2", "dashboard.entryTicket", v)} />
            <StatCell label={`IRR (${exitMode})`} value={exitMode === "Rental" ? t.dashboard.irrRental : t.dashboard.irrSale} onSave={(v) => updateTab("tab2", exitMode === "Rental" ? "dashboard.irrRental" : "dashboard.irrSale", v)} />
            <StatCell label={`ROI (${exitMode})`} value={exitMode === "Rental" ? t.dashboard.roiRental : t.dashboard.roiSale} onSave={(v) => updateTab("tab2", exitMode === "Rental" ? "dashboard.roiRental" : "dashboard.roiSale", v)} />
            <StatCell label="Term" value={t.dashboard.term} onSave={(v) => updateTab("tab2", "dashboard.term", v)} />
          </div>
        </Card>
      </SectionWrap>

      <SectionWrap isVisible={t.faq.isVisible} onToggle={() => updateTab("tab2", "faq.isVisible", !t.faq.isVisible)} label="FAQ">
        <Card>
          <h2 className="text-2xl font-bold mb-6"><EditableText value={t.faq.title} onSave={(v) => updateTab("tab2", "faq.title", v)} /></h2>
          <div className="space-y-3">
            {t.faq.items.map((item: any, i: number) => (
              <div key={i} className={`relative bg-accent/30 rounded-xl p-4 ${!item.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && (
                  <div className="absolute top-2 right-2">
                    <VisibilityToggle isVisible={item.isVisible} onToggle={() => {
                      const items = [...t.faq.items]; items[i] = { ...items[i], isVisible: !item.isVisible }; updateTab("tab2", "faq.items", items);
                    }} />
                  </div>
                )}
                <div className="font-bold mb-1"><EditableText value={item.q} onSave={(v) => { const items = [...t.faq.items]; items[i] = { ...items[i], q: v }; updateTab("tab2", "faq.items", items); }} /></div>
                <div className="text-muted-foreground text-sm"><EditableText multiline value={item.a} onSave={(v) => { const items = [...t.faq.items]; items[i] = { ...items[i], a: v }; updateTab("tab2", "faq.items", items); }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab2" />
    </div>
  );
}

const StatCell = ({ label, value, onSave }: { label: string; value: string; onSave: (v: string) => void }) => (
  <div className="bg-accent/30 rounded-2xl p-5 border border-border">
    <div className="text-xs font-bold uppercase text-muted-foreground mb-2">{label}</div>
    <div className="text-3xl md:text-4xl font-extrabold text-foreground"><EditableText value={value} onSave={onSave} /></div>
  </div>
);

// ---------- TAB 3 ----------
export function Tab3() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab3;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.funnel.isVisible} onToggle={() => updateTab("tab3", "funnel.isVisible", !t.funnel.isVisible)} label="Funnel">
        <Card>
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3"><EditableText value={t.funnel.title} onSave={(v) => updateTab("tab3", "funnel.title", v)} /></h3>
          <p className="text-lg text-muted-foreground leading-relaxed"><EditableText multiline value={t.funnel.text} onSave={(v) => updateTab("tab3", "funnel.text", v)} /></p>
        </Card>
      </SectionWrap>
      <div className="grid md:grid-cols-2 gap-6">
        <SectionWrap isVisible={t.epicenter.isVisible} onToggle={() => updateTab("tab3", "epicenter.isVisible", !t.epicenter.isVisible)} label="Epicenter">
          <Card><Map className="text-primary mb-3" size={28} /><h4 className="font-bold text-xl mb-2"><EditableText value={t.epicenter.title} onSave={(v) => updateTab("tab3", "epicenter.title", v)} /></h4><p className="text-muted-foreground"><EditableText multiline value={t.epicenter.text} onSave={(v) => updateTab("tab3", "epicenter.text", v)} /></p></Card>
        </SectionWrap>
        <SectionWrap isVisible={t.proximity.isVisible} onToggle={() => updateTab("tab3", "proximity.isVisible", !t.proximity.isVisible)} label="Proximity">
          <Card><Building className="text-primary mb-3" size={28} /><h4 className="font-bold text-xl mb-2"><EditableText value={t.proximity.title} onSave={(v) => updateTab("tab3", "proximity.title", v)} /></h4><p className="text-muted-foreground"><EditableText multiline value={t.proximity.text} onSave={(v) => updateTab("tab3", "proximity.text", v)} /></p></Card>
        </SectionWrap>
      </div>
      <CustomBlocks tabKey="tab3" />
    </div>
  );
}

// ---------- TAB 4 ----------
export function Tab4() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab4;
  const pillarKeys: Array<["rail" | "aviation" | "road" | "warehousing", React.ReactNode]> = [
    ["rail", <Train size={28} key="r" />],
    ["aviation", <Plane size={28} key="a" />],
    ["road", <Truck size={28} key="d" />],
    ["warehousing", <Warehouse size={28} key="w" />],
  ];
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.intro.isVisible} onToggle={() => updateTab("tab4", "intro.isVisible", !t.intro.isVisible)} label="Intro">
        <Card dark><h2 className="text-2xl md:text-3xl font-bold mb-3"><EditableText value={t.intro.title} onSave={(v) => updateTab("tab4", "intro.title", v)} /></h2><p className="text-lg opacity-90"><EditableText multiline value={t.intro.text} onSave={(v) => updateTab("tab4", "intro.text", v)} /></p></Card>
      </SectionWrap>
      <SectionWrap isVisible={t.pillars.isVisible} onToggle={() => updateTab("tab4", "pillars.isVisible", !t.pillars.isVisible)} label="Pillars">
        <Card>
          <h3 className="text-xl font-bold text-center mb-6 uppercase tracking-wide"><EditableText value={t.pillars.title} onSave={(v) => updateTab("tab4", "pillars.title", v)} /></h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillarKeys.map(([k, icon]) => {
              const p = t.pillars[k];
              return (
                <SectionWrap key={k} isVisible={p.isVisible} onToggle={() => updateTab("tab4", `pillars.${k}.isVisible`, !p.isVisible)} label={k}>
                  <div className="bg-accent/30 p-5 rounded-2xl border border-border h-full">
                    <div className="mb-4 text-primary">{icon}</div>
                    <h4 className="font-bold mb-1"><EditableText value={p.title} onSave={(v) => updateTab("tab4", `pillars.${k}.title`, v)} /></h4>
                    <div className="text-sm text-muted-foreground mb-3"><EditableText value={p.sub} onSave={(v) => updateTab("tab4", `pillars.${k}.sub`, v)} /></div>
                    <div className="inline-block border border-border rounded-full px-3 py-1 text-xs font-bold mb-3"><EditableText value={p.stat} onSave={(v) => updateTab("tab4", `pillars.${k}.stat`, v)} /></div>
                    <p className="text-sm text-muted-foreground border-t border-border pt-3"><EditableText multiline value={p.details} onSave={(v) => updateTab("tab4", `pillars.${k}.details`, v)} /></p>
                  </div>
                </SectionWrap>
              );
            })}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab4" />
    </div>
  );
}

// ---------- TAB 5 ----------
export function Tab5() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab5;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.benchmarks.isVisible} onToggle={() => updateTab("tab5", "benchmarks.isVisible", !t.benchmarks.isVisible)} label="Benchmarks">
        <Card><h3 className="text-2xl font-bold mb-3"><EditableText value={t.benchmarks.title} onSave={(v) => updateTab("tab5", "benchmarks.title", v)} /></h3><p className="text-muted-foreground"><EditableText multiline value={t.benchmarks.text} onSave={(v) => updateTab("tab5", "benchmarks.text", v)} /></p></Card>
      </SectionWrap>
      <SectionWrap isVisible={t.risk.isVisible} onToggle={() => updateTab("tab5", "risk.isVisible", !t.risk.isVisible)} label="Risk">
        <Card>
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Shield className="text-primary" /><EditableText value={t.risk.title} onSave={(v) => updateTab("tab5", "risk.title", v)} /></h3>
          <div className="grid md:grid-cols-3 gap-4">
            {t.risk.items.map((item: any, i: number) => (
              <div key={i} className={`bg-accent/30 p-5 rounded-2xl border border-border relative ${!item.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && (
                  <div className="absolute top-2 right-2"><VisibilityToggle isVisible={item.isVisible} onToggle={() => { const items = [...t.risk.items]; items[i] = { ...items[i], isVisible: !item.isVisible }; updateTab("tab5", "risk.items", items); }} /></div>
                )}
                <h4 className="font-bold mb-2"><EditableText value={item.t} onSave={(v) => { const items = [...t.risk.items]; items[i] = { ...items[i], t: v }; updateTab("tab5", "risk.items", items); }} /></h4>
                <p className="text-sm text-muted-foreground"><EditableText multiline value={item.d} onSave={(v) => { const items = [...t.risk.items]; items[i] = { ...items[i], d: v }; updateTab("tab5", "risk.items", items); }} /></p>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab5" />
    </div>
  );
}

// ---------- TAB 6 ----------
export function Tab6() {
  const { content, sector, language, updateTab, isEditingMode } = useApp();
  const t = content[sector][language].tab6;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.timeline.isVisible} onToggle={() => updateTab("tab6", "timeline.isVisible", !t.timeline.isVisible)} label="Timeline">
        <Card>
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3"><Calculator className="text-primary" /><EditableText value={t.timeline.title} onSave={(v) => updateTab("tab6", "timeline.title", v)} /></h2>
          <div className="grid md:grid-cols-4 gap-4">
            {t.timeline.phases.map((phase: any, i: number) => (
              <div key={i} className={`relative bg-accent/30 p-5 rounded-2xl border border-border ${!phase.isVisible ? "opacity-40 grayscale" : ""}`}>
                {isEditingMode && (
                  <div className="absolute top-2 right-2"><VisibilityToggle isVisible={phase.isVisible} onToggle={() => { const ph = [...t.timeline.phases]; ph[i] = { ...ph[i], isVisible: !phase.isVisible }; updateTab("tab6", "timeline.phases", ph); }} /></div>
                )}
                <div className="text-primary font-bold text-xs uppercase mb-2">Phase {i + 1}</div>
                <h4 className="font-bold mb-2"><EditableText value={phase.name} onSave={(v) => { const ph = [...t.timeline.phases]; ph[i] = { ...ph[i], name: v }; updateTab("tab6", "timeline.phases", ph); }} /></h4>
                <p className="text-sm text-muted-foreground"><EditableText multiline value={phase.desc} onSave={(v) => { const ph = [...t.timeline.phases]; ph[i] = { ...ph[i], desc: v }; updateTab("tab6", "timeline.phases", ph); }} /></p>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={t.protection.isVisible} onToggle={() => updateTab("tab6", "protection.isVisible", !t.protection.isVisible)} label="Protection">
        <Card dark><h3 className="text-2xl font-bold mb-3"><EditableText value={t.protection.title} onSave={(v) => updateTab("tab6", "protection.title", v)} /></h3><p className="opacity-90"><EditableText multiline value={t.protection.text} onSave={(v) => updateTab("tab6", "protection.text", v)} /></p></Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab6" />
    </div>
  );
}

// ---------- TAB 7 ----------
export function Tab7() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab7;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.metrics.isVisible} onToggle={() => updateTab("tab7", "metrics.isVisible", !t.metrics.isVisible)} label="Metrics">
        <Card>
          <h2 className="text-2xl font-bold mb-6"><EditableText value={t.metrics.title} onSave={(v) => updateTab("tab7", "metrics.title", v)} /></h2>
          <div className="grid md:grid-cols-2 gap-6">
            {["fos", "fot"].map((k) => {
              const m = t.metrics[k];
              return (
                <SectionWrap key={k} isVisible={m.isVisible} onToggle={() => updateTab("tab7", `metrics.${k}.isVisible`, !m.isVisible)} label={k.toUpperCase()}>
                  <div className="bg-accent/30 p-6 rounded-2xl border border-border">
                    <div className="text-5xl font-extrabold mb-2"><EditableText value={m.val} onSave={(v) => updateTab("tab7", `metrics.${k}.val`, v)} /></div>
                    <div className="font-bold text-sm uppercase mb-2"><EditableText value={m.label} onSave={(v) => updateTab("tab7", `metrics.${k}.label`, v)} /></div>
                    <p className="text-sm text-muted-foreground"><EditableText multiline value={m.desc} onSave={(v) => updateTab("tab7", `metrics.${k}.desc`, v)} /></p>
                  </div>
                </SectionWrap>
              );
            })}
          </div>
        </Card>
      </SectionWrap>
      <SectionWrap isVisible={t.specs.isVisible} onToggle={() => updateTab("tab7", "specs.isVisible", !t.specs.isVisible)} label="Specs">
        <Card><h3 className="text-xl font-bold mb-3"><EditableText value={t.specs.title} onSave={(v) => updateTab("tab7", "specs.title", v)} /></h3><p className="text-muted-foreground"><EditableText multiline value={t.specs.text} onSave={(v) => updateTab("tab7", "specs.text", v)} /></p></Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab7" />
    </div>
  );
}

// ---------- TAB 8 ----------
export function Tab8() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab8;
  const [pct, setPct] = useState(0);
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.mixer.isVisible} onToggle={() => updateTab("tab8", "mixer.isVisible", !t.mixer.isVisible)} label="Mixer">
        <Card>
          <h2 className="text-2xl font-bold mb-3"><EditableText value={t.mixer.title} onSave={(v) => updateTab("tab8", "mixer.title", v)} /></h2>
          <p className="text-muted-foreground mb-6"><EditableText multiline value={t.mixer.text} onSave={(v) => updateTab("tab8", "mixer.text", v)} /></p>
          <div className="bg-accent/30 rounded-2xl p-6 border border-border">
            <label className="text-sm font-bold mb-2 block">Operational contribution: {pct}%</label>
            <input type="range" min={0} max={50} step={10} value={pct} onChange={(e) => setPct(+e.target.value)} className="w-full" />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><div className="text-xs uppercase text-muted-foreground">Cash needed</div><div className="text-2xl font-bold">{(500000 * (1 - pct / 100)).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</div></div>
              <div><div className="text-xs uppercase text-muted-foreground">Operational equity</div><div className="text-2xl font-bold">{pct}%</div></div>
            </div>
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab8" />
    </div>
  );
}

// ---------- TAB 9 ----------
export function Tab9() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab9;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.builder.isVisible} onToggle={() => updateTab("tab9", "builder.isVisible", !t.builder.isVisible)} label="LOI">
        <Card>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FileBox className="text-primary" /><EditableText value={t.builder.title} onSave={(v) => updateTab("tab9", "builder.title", v)} /></h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["investorName", "Investor"],
              ["entryAmount", "Entry Amount (USD)"],
              ["structure", "Structure"],
              ["package", "Package"],
            ].map(([k, label]) => (
              <div key={k} className="bg-accent/30 p-5 rounded-xl border border-border">
                <div className="text-xs uppercase font-bold text-muted-foreground mb-1">{label}</div>
                <div className="text-lg font-semibold"><EditableText value={t.builder[k]} onSave={(v) => updateTab("tab9", `builder.${k}`, v)} /></div>
              </div>
            ))}
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab9" />
    </div>
  );
}

// ---------- TAB 10 ----------
export function Tab10() {
  const { content, sector, language, updateTab } = useApp();
  const t = content[sector][language].tab10;
  return (
    <div className="space-y-6">
      <SectionWrap isVisible={t.data.isVisible} onToggle={() => updateTab("tab10", "data.isVisible", !t.data.isVisible)} label="Market Data">
        <Card>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Info className="text-primary" /><EditableText value={t.data.title} onSave={(v) => updateTab("tab10", "data.title", v)} /></h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left"><th className="py-2">Category</th><th className="py-2">Metric</th><th className="py-2">Current</th><th className="py-2">Projected</th></tr></thead>
              <tbody>
                {t.data.items.map((item: any, i: number) => (
                  <tr key={i} className={`border-b border-border ${!item.isVisible ? "opacity-40 grayscale" : ""}`}>
                    <td className="py-3"><EditableText value={item.cat} onSave={(v) => { const items = [...t.data.items]; items[i] = { ...items[i], cat: v }; updateTab("tab10", "data.items", items); }} /></td>
                    <td className="py-3"><EditableText value={item.label} onSave={(v) => { const items = [...t.data.items]; items[i] = { ...items[i], label: v }; updateTab("tab10", "data.items", items); }} /></td>
                    <td className="py-3 font-semibold"><EditableText value={item.current} onSave={(v) => { const items = [...t.data.items]; items[i] = { ...items[i], current: v }; updateTab("tab10", "data.items", items); }} /></td>
                    <td className="py-3 font-semibold"><EditableText value={item.proj} onSave={(v) => { const items = [...t.data.items]; items[i] = { ...items[i], proj: v }; updateTab("tab10", "data.items", items); }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </SectionWrap>
      <CustomBlocks tabKey="tab10" />
    </div>
  );
}

export const TAB_COMPONENTS: Record<string, React.FC> = {
  tab1: Tab1, tab2: Tab2, tab3: Tab3, tab4: Tab4, tab5: Tab5,
  tab6: Tab6, tab7: Tab7, tab8: Tab8, tab9: Tab9, tab10: Tab10,
};
