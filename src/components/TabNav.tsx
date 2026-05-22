import { useApp } from "@/state/store";
import { TAB_KEYS } from "@/lib/default-content";
import { EditableText } from "./editor/EditableText";
import { VisibilityToggle } from "./editor/Toggle";

interface Props {
  activeTab: string;
  setActiveTab: (k: string) => void;
}

export function TabNav({ activeTab, setActiveTab }: Props) {
  const { content, sector, language, isEditingMode, updateTab } = useApp();
  const tabs = content[sector][language];

  return (
    <div className="flex flex-wrap gap-2 my-6 bg-card p-2 rounded-2xl border border-border">
      {TAB_KEYS.map((key) => {
        const t = tabs[key];
        if (!t.isVisible && !isEditingMode) return null;
        const isActive = activeTab === key;
        return (
          <div key={key} className={`relative flex-shrink-0 ${!t.isVisible ? "opacity-40 grayscale" : ""}`}>
            <button
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                isActive ? "bg-foreground text-background shadow-md" : "hover:bg-accent text-foreground"
              }`}
            >
              <EditableText
                value={t.title}
                onSave={(v) => updateTab(key, "title", v)}
              />
            </button>
            {isEditingMode && (
              <div className="absolute -top-2 -right-2">
                <VisibilityToggle isVisible={t.isVisible} onToggle={() => updateTab(key, "isVisible", !t.isVisible)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
