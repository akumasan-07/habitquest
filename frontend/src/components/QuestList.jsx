import { useState } from "react";
import { cn } from "@/lib/utils";

const QuestList = ({ quests, isCompleted, onToggle, onDelete, onRename }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (quest) => {
    setEditingId(quest.id);
    setEditValue(quest.title);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  if (quests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No quests yet 🗡️</p>
        <p className="text-sm mt-1">Add your first quest to begin the adventure</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {quests.map((quest, i) => {
        const done = isCompleted(quest.id);
        const isEditing = editingId === quest.id;
        return (
          <li
            key={quest.id}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border transition-all animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <button
              onClick={() => onToggle(quest.id)}
              className={cn(
                "shrink-0 h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all",
                done
                  ? "bg-primary border-primary animate-check-pop"
                  : "border-muted-foreground/30 hover:border-primary/60"
              )}
              aria-label={done ? "Undo quest" : "Complete quest"}
            >
              {done && (
                <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>

            {isEditing ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 text-sm font-medium bg-transparent border-b border-primary outline-none py-0.5"
              />
            ) : (
              <span
                className={cn(
                  "flex-1 text-sm font-medium transition-all",
                  done && "line-through text-muted-foreground"
                )}
              >
                {quest.title}
              </span>
            )}

            <button
              onClick={() => startEditing(quest)}
              className="text-muted-foreground/40 hover:text-foreground transition-colors p-1"
              aria-label="Rename quest"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(quest.id)}
              className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
              aria-label="Abandon quest"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default QuestList;
