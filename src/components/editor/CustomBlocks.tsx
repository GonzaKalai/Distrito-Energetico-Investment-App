import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2, Type, AlignLeft, BarChart3, Columns2, Minus, HelpCircle } from "lucide-react";
import { useApp } from "@/state/store";
import type { CustomBlock } from "@/lib/types";
import { EditableText } from "./EditableText";
import { VisibilityToggle } from "./Toggle";

const uid = () => Math.random().toString(36).slice(2, 9);
const EMPTY_BLOCKS: CustomBlock[] = [];

interface Props {
  tabKey: string;
}

export function CustomBlocks({ tabKey }: Props) {
  const isEditingMode = useApp((s) => s.isEditingMode);
  const rawBlocks = useApp((s) => s.content[s.sector][s.language][tabKey].customBlocks);
  const blocks: CustomBlock[] = rawBlocks ?? EMPTY_BLOCKS;
  const addBlock = useApp((s) => s.addCustomBlock);
  const reorder = useApp((s) => s.reorderCustomBlocks);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const visibleBlocks = isEditingMode ? blocks : blocks.filter((b) => b.visible);

  const add = (type: CustomBlock["type"]) => {
    const base = { id: uid(), visible: true };
    let block: CustomBlock;
    switch (type) {
      case "heading": block = { ...base, type, text: "New heading" }; break;
      case "paragraph": block = { ...base, type, text: "New paragraph text..." }; break;
      case "stat": block = { ...base, type, label: "Label", value: "100%" }; break;
      case "split": block = { ...base, type, left: "Left content", right: "Right content" }; break;
      case "divider": block = { ...base, type }; break;
      case "faq": block = { ...base, type, q: "Question?", a: "Answer." }; break;
    }
    addBlock(tabKey, block);
  };

  return (
    <div className="space-y-4">
      {visibleBlocks.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return;
            const oldIdx = blocks.findIndex((b) => b.id === active.id);
            const newIdx = blocks.findIndex((b) => b.id === over.id);
            reorder(tabKey, arrayMove(blocks, oldIdx, newIdx));
          }}
        >
          <SortableContext items={visibleBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {visibleBlocks.map((b) => (
              <SortableBlock key={b.id} tabKey={tabKey} block={b} />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {isEditingMode && (
        <div className="rounded-2xl border-2 border-dashed border-border bg-card/50 p-4">
          <div className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
            <Plus size={14} /> Add custom block
          </div>
          <div className="flex flex-wrap gap-2">
            <AddBtn icon={<Type size={14} />} label="Heading" onClick={() => add("heading")} />
            <AddBtn icon={<AlignLeft size={14} />} label="Paragraph" onClick={() => add("paragraph")} />
            <AddBtn icon={<BarChart3 size={14} />} label="Stat" onClick={() => add("stat")} />
            <AddBtn icon={<Columns2 size={14} />} label="2-Column" onClick={() => add("split")} />
            <AddBtn icon={<HelpCircle size={14} />} label="FAQ" onClick={() => add("faq")} />
            <AddBtn icon={<Minus size={14} />} label="Divider" onClick={() => add("divider")} />
          </div>
        </div>
      )}
    </div>
  );
}

function AddBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-medium hover:bg-accent hover:border-primary transition-colors"
    >
      {icon} {label}
    </button>
  );
}

function SortableBlock({ tabKey, block }: { tabKey: string; block: CustomBlock }) {
  const isEditingMode = useApp((s) => s.isEditingMode);
  const update = useApp((s) => s.updateCustomBlock);
  const remove = useApp((s) => s.removeCustomBlock);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} className={`relative bg-card rounded-2xl border border-border p-6 ${!block.visible ? "opacity-40 grayscale" : ""}`}>
      {isEditingMode && (
        <div className="absolute right-3 top-3 z-10 flex gap-2 items-center">
          <button {...attributes} {...listeners} title="Drag" className="p-1.5 rounded hover:bg-accent cursor-grab active:cursor-grabbing">
            <GripVertical size={14} />
          </button>
          <VisibilityToggle isVisible={block.visible} onToggle={() => update(tabKey, block.id, { visible: !block.visible })} />
          <button onClick={() => remove(tabKey, block.id)} title="Delete" className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
            <Trash2 size={14} />
          </button>
        </div>
      )}
      <BlockBody tabKey={tabKey} block={block} />
    </div>
  );
}

function BlockBody({ tabKey, block }: { tabKey: string; block: CustomBlock }) {
  const update = useApp((s) => s.updateCustomBlock);
  switch (block.type) {
    case "heading":
      return <h3 className="text-2xl font-bold text-foreground"><EditableText value={block.text} onSave={(v) => update(tabKey, block.id, { text: v })} /></h3>;
    case "paragraph":
      return <p className="text-base text-muted-foreground leading-relaxed"><EditableText multiline value={block.text} onSave={(v) => update(tabKey, block.id, { text: v })} /></p>;
    case "stat":
      return (
        <div>
          <div className="text-xs font-bold uppercase text-muted-foreground mb-2"><EditableText value={block.label} onSave={(v) => update(tabKey, block.id, { label: v })} /></div>
          <div className="text-4xl font-extrabold text-foreground"><EditableText value={block.value} onSave={(v) => update(tabKey, block.id, { value: v })} /></div>
        </div>
      );
    case "split":
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-base text-foreground"><EditableText multiline value={block.left} onSave={(v) => update(tabKey, block.id, { left: v })} /></div>
          <div className="text-base text-foreground"><EditableText multiline value={block.right} onSave={(v) => update(tabKey, block.id, { right: v })} /></div>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-2">
          <div className="font-bold text-foreground"><EditableText value={block.q} onSave={(v) => update(tabKey, block.id, { q: v })} /></div>
          <div className="text-muted-foreground"><EditableText multiline value={block.a} onSave={(v) => update(tabKey, block.id, { a: v })} /></div>
        </div>
      );
    case "divider":
      return <hr className="border-border" />;
  }
}
