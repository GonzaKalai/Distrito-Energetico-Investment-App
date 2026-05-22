import { useEffect, useRef, useState } from "react";
import { useApp } from "@/state/store";

interface Props {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export function EditableText({ value, onSave, multiline, className = "", placeholder = "..." }: Props) {
  const isEditingMode = useApp((s) => s.isEditingMode);
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => setTmp(value), [value]);
  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  // Exit editing mode whenever the global editing toggle turns off.
  useEffect(() => {
    if (!isEditingMode) setEditing(false);
  }, [isEditingMode]);

  if (!isEditingMode) {
    return <span className={`whitespace-pre-wrap ${className}`}>{value || placeholder}</span>;
  }

  if (editing) {
    const commit = () => { onSave(tmp); setEditing(false); };
    const cancel = () => { setTmp(value); setEditing(false); };

    return (
      <span className="block">
        {multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={tmp}
            onChange={(e) => setTmp(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              // Escape cancels; Ctrl/Cmd+Enter commits without blur.
              if (e.key === "Escape") { e.preventDefault(); cancel(); }
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); commit(); }
            }}
            rows={Math.max(3, tmp.split("\n").length)}
            className="w-full p-2 rounded-md border-2 border-primary bg-background text-foreground text-sm"
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            value={tmp}
            onChange={(e) => setTmp(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") cancel();
            }}
            className={`w-full p-1 rounded-md border-2 border-primary bg-background text-foreground ${className}`}
          />
        )}
      </span>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`whitespace-pre-wrap cursor-text rounded px-0.5 -mx-0.5 hover:bg-accent/40 hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/40 transition-colors ${className}`}
      title="Click to edit"
    >
      {value || <span className="italic opacity-50">{placeholder}</span>}
    </span>
  );
}
