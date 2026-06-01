import { useState } from "react"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { deleteAccount } from "@/lib/authApi";
import { useAuth } from "@/context/AuthContext";

const DeleteAccountConfirmation = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if(!password.trim()){
      toast.error("Password is required!");
      return;
    }
    setLoading(true);

    try{
      await deleteAccount(password);
      setPassword("");
      setOpen(false);
      toast.success("Account deleted successfully!");

      logout();
      navigate("/login");

    }catch(error){
      if(!error.response){
        toast.error("Server unavailable. Please try again later.");
      }else{
        toast.error(
          error.response.data?.message ||
          "Failed to delete account"
        );
      }

    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <button
      onClick={() => setOpen(true)}
      className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
        Delete Account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setPassword("");
              setOpen(false);
            }}
          />

          <div
            className="relative bg-card border border-border rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">
              Delete Account?
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone.
              All quests, streaks and history will be permanently deleted.
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Forever"}
              </button>

              <button
                onClick={() => {
                  setPassword("");
                  setOpen(false);
                }}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteAccountConfirmation