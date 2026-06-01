import { Trash2 } from 'lucide-react';
import {useState} from 'react'

const DeleteQuestConfirmation = ({onDelete, questId}) => {
    const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground/40 hover:text-destructive transition-colors p-1" 
        aria-label="Abandon quest"
      >
        <Trash2 className='h-4 w-4' />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg"
          onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Delete quest?</h2>
            <p className="text-sm text-muted-foreground">
                This will permanently remove the quest and all its history.
            </p>
            <div className="flex gap-2 mt-4">
                <button
                    onClick={async () => {
                      const success = await onDelete(questId);
                      if(success){
                        setOpen(false); 
                      } 
                    }}
                    className="px-4 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                    Delete
                </button>
                <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    Cancel
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteQuestConfirmation