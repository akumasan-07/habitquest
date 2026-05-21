import { ListPlus } from "lucide-react";
import { useState } from "react";

const AddQuestDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim()) {
      const added = onAdd(title.trim());
      if(!added){
        setError("Quest already exists!");
        return;
      }

      setError("");
      setTitle("");
      setOpen(false);
    }
  };
  

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <ListPlus className="h-4 w-4"/>
        New Quest
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => {setOpen(false); setError("");setTitle("");}} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Set a new quest</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                placeholder="e.g. Train, Study, Practice..."
                value={title}
                onChange={(e) => {setTitle(e.target.value); setError("");}}
                autoFocus
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Add Quest
              </button>
            </form>
            {error && (
              <p className="text-sm text-destructive mt-2 ml-2">
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuestDialog;
