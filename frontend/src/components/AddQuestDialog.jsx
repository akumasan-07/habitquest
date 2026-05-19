import { useState } from "react";

const AddQuestDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
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
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14.5 17.5 3-3 3 3" /><path d="m14.5 6.5 3 3 3-3" /><path d="M3 17V7c0-1.1.9-2 2-2h9.5" /><path d="M3 7h9.5" /><path d="M3 12h9.5" />
        </svg>
        New Quest
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Set a new quest</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                placeholder="e.g. Train, Study, Practice..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Accept
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddQuestDialog;
