import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DeleteQuestConfirmation from "./DeleteQuestConfirmation";

const QuestList = ({ quests, isCompleted, onToggle, onDelete, onRename }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (quest) => {
    setEditingId(quest.id);
    setEditValue(quest.title);
  };

  const commitEdit = async () => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      return;
    }

    const result = await onRename(editingId, editValue.trim());

    if(result === "duplicate"){
      toast.error("Quest already exists!");
      setEditingId(null);
      return;
    }

    if(result === "error"){
      setEditingId(null);
      return;
    }

    setEditingId(null);
  };

  if (quests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No quests yet 🗡️</p>
        <p className="text-sm mt-1">Add your first quest to start your journey</p>
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
            className="flex items-center gap-3 px-4 py-3 rounded-md bg-card border border-border transition-all animate-fade-in"
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
                <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3}/>
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
                  if (e.key === "Escape") {
                    setEditValue("");
                    setEditingId(null);
                  }
                }}
                className="flex-1 text-sm font-medium bg-transparent border-b border-primary outline-none py-0.5"
              />
            ) : (
              <span className={cn(
                  "flex-1 text-sm font-medium transition-all wrap-break-word",
                  done && "line-through text-muted-foreground"
                )}
              >
                {quest.title}
              </span>
            )}

            
            {quest.currentStreak > 0 && (
              <span className="text-xs font-medium text-orange-500 shrink-0">
                🔥 {quest.currentStreak}
              </span>
            )}
            <button
              onClick={() => startEditing(quest)}
              className="text-muted-foreground/40 hover:text-foreground transition-colors p-1"
              aria-label="Rename quest"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <DeleteQuestConfirmation 
              onDelete={onDelete}
              questId={quest.id}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default QuestList;
