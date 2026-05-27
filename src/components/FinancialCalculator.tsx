import { useState, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign, Clock, BarChart3 } from "lucide-react";

function calcIRR(cashFlows: number[]): number {
  let rate = 0.15;
  for (let i = 0; i < 200; i++) {
    let npv = 0, dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const disc = Math.pow(1 + rate, t);
      npv += cashFlows[t] / disc;
      dnpv -= t * cashFlows[t] / (disc * (1 + rate));
    }
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 1e-8) return newRate;
    rate = newRate;
    if (rate < -0.99) rate = -0.99;
  }
  return rate;
}

const fmt = (n: number, dec = 0) =>
  n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const pct = (n: number) => (n * 100).toFixed(1) + "%";

export function FinancialCalculator() {
  const [landPrice, setLandPrice] = useState(200000);
  const [infraCost, setInfraCost] = useState(100000);
  const [buildCost, setBuildCost] = useState(300000);
  const [monthlyRent, setMonthlyRent] = useState(8000);
  const [vacancy, setVacancy] = useState(10);
  const [termYears, setTermYears] = useState(10);
  const [exitCapRate, setExitCapRate] = useState(8);
  const [open, setOpen] = useState(true);

  const metrics = useMemo(() => {
    const totalInv = landPrice + infraCost + buildCost;
    const noi = monthlyRent * 12 * (1 - vacancy / 100);
    const capRate = totalInv > 0 ? noi / totalInv : 0;
    const terminalValue = exitCapRate > 0 ? noi / (exitCapRate / 100) : 0;
    const cashFlows = [-totalInv, ...Array(termYears).fill(noi)];
    cashFlows[termYears] += terminalValue;
    const irr = totalInv > 0 ? calcIRR(cashFlows) : 0;
    const totalCF = noi * termYears + terminalValue;
    const equityMult = totalInv > 0 ? totalCF / totalInv : 0;
    const payback = noi > 0 ? totalInv / noi : 0;
    return { totalInv, noi, capRate, terminalValue, irr, equityMult, payback };
  }, [landPrice, infraCost, buildCost, monthlyRent, vacancy, termYears, exitCapRate]);

  const Input = ({ label, value, onChange, prefix = "USD", step = 10000 }: {
    label: string; value: number; onChange: (v: number) => void; prefix?: string; step?: number;
  }) => (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">{label}</label>
      <div className="flex items-center gap-1 border border-border rounded-xl px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-primary/30">
        <span className="text-xs text-muted-foreground shrink-0">{prefix}</span>
        <input
          type="number"
          value={value}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent text-sm font-medium outline-none text-right"
        />
      </div>
    </div>
  );

  const Metric = ({ icon: Icon, label, value, color = "text-foreground", sub }: {
    icon: any; label: string; value: string; color?: string; sub?: string;
  }) => (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon size={14} />
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calculator className="text-primary" size={20} />
          <span className="font-bold text-lg">Calculadora Financiera</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Live</span>
        </div>
        <span className="text-muted-foreground text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-6 border-t border-border pt-5">
          <div>
            <p className="text-xs text-muted-foreground mb-4">Ingresá los valores del deal — los métricas se calculan en tiempo real.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Input label="Precio del terreno" value={landPrice} onChange={setLandPrice} />
              <Input label="Infraestructura / servicios" value={infraCost} onChange={setInfraCost} />
              <Input label="Costo de construcción" value={buildCost} onChange={setBuildCost} />
              <Input label="Alquiler mensual estimado" value={monthlyRent} onChange={setMonthlyRent} step={500} />
              <Input label="Vacancia %" value={vacancy} onChange={setVacancy} prefix="%" step={1} />
              <Input label="Plazo (años)" value={termYears} onChange={setTermYears} prefix="años" step={1} />
              <Input label="Cap rate de salida %" value={exitCapRate} onChange={setExitCapRate} prefix="%" step={0.5} />
              <div className="bg-accent/30 rounded-xl p-3 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Inversión total</div>
                <div className="text-lg font-bold">USD {fmt(metrics.totalInv)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Metric
              icon={TrendingUp} label="IRR" value={pct(metrics.irr)}
              color={metrics.irr > 0.15 ? "text-emerald-500" : metrics.irr > 0.1 ? "text-yellow-500" : "text-rose-500"}
              sub="Tasa interna de retorno"
            />
            <Metric icon={BarChart3} label="Cap Rate" value={pct(metrics.capRate)} sub="NOI / Inversión total" />
            <Metric icon={DollarSign} label="NOI anual" value={`USD ${fmt(metrics.noi)}`} sub="Ingreso neto operativo" />
            <Metric icon={TrendingUp} label="Equity Multiple" value={`${metrics.equityMult.toFixed(2)}x`} sub="Retorno total / inversión" />
            <Metric icon={Clock} label="Payback" value={`${metrics.payback.toFixed(1)} años`} sub="Recupero de capital" />
            <Metric icon={DollarSign} label="Valor Terminal" value={`USD ${fmt(metrics.terminalValue)}`} sub={`A cap rate ${exitCapRate}%`} />
          </div>
        </div>
      )}
    </div>
  );
}
