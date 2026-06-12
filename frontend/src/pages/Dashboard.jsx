import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, subDays } from "date-fns";
import {FileText, LogOut} from "lucide-react";
import { toast } from "sonner";

import { useQuestData } from "@/hooks/useQuestData";
import QuestList from "@/components/QuestList";
import AddQuestDialog from "@/components/AddQuestDialog";
import DayProgress from "@/components/DayProgress";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  addQuest as addQuestApi,
  renameQuest as renameQuestApi,
  deleteQuest as deleteQuestApi,
  toggleQuest as toggleQuestApi,
  getQuests as getQuestsApi,
} from "@/lib/questApi";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Rise and Grind";
  if (h < 17) return "Stay the Course";
  if (h < 21) return "Finish Strong";
  return "Return to Camp";
};

const getSubtitle = () => {
  const h = new Date().getHours();
  if (h >= 20 || h < 3)
    return "Legends aren't built in comfort zones. Finish your quests before you rest.";
  return "Complete your quests and level up.";
};

const TODAY = format(new Date(), "yyyy-MM-dd");
const YESTERDAY = format(subDays(new Date(), 1), "yyyy-MM-dd");

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const isToday = selectedDate === TODAY;
  const day = isToday ? "today" : "yesterday";
  const { 
    quests, 
    setQuests, 
    loading,
    error,
  } = useQuestData(day);

  const completed = quests.filter((q) => q.completed).length;
  const total = quests.length;

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAddQuest = async (title) => {
    try{
      const newQuest = await addQuestApi(title);

      setQuests((prev) => [
        {
          ...newQuest,
          id: newQuest._id,
          completed: false,
        },
        ...prev,
      ]);
      toast.success("Quest added");

      return "success";
    }catch(error){
      if(error.response?.status === 400){
        return "duplicate";
      }

      toast.error("Failed to add quest");
      return "error";
    }
  };

  const handleRenameQuest = async (id, title) => {
    try{
      const updatedQuest = await renameQuestApi(id, title);

      setQuests((prev) => 
        prev.map((quest) => 
          quest.id === id
            ? {
              ...quest,
              ...updatedQuest,
              id: updatedQuest._id,
              }
            : quest
        )
      );

      return "success";
    }catch (error){
      if(error.response?.status === 400){
        return "duplicate";
      }
      toast.error("Failed to rename quest");
      return "error";
    }
  };

  const handleDeleteQuest = async (id) => {
    try{
      await deleteQuestApi(id);
      setQuests((prev) => 
        prev.filter((quest) => quest.id !== id)
      );

      toast.success("Quest deleted");
      return true;
    }catch(error){
      toast.error("Failed to delete quest");

      return false;
    }
  };

  const handleToggleQuest = async (id) => {
    try{
      await toggleQuestApi(id, day);

      const data = await getQuestsApi(day);

      setQuests(
        data.map((quest) => ({
          ...quest,
          id: quest._id,
        }))
      );
    }catch (error){
      console.error(error);
      toast.error("Failed to update quest");
    }
  };


  return (
    <div className="min-h-screen bg-background">
      
      <div className="container max-w-5xl py-8 md:py-10 px-10 lg:px-4 mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl max-sm:text-xl font-bold">{getGreeting()}, {user?.username}⚔️</h1>
            <p className="text-sm max-sm:text-xs text-muted-foreground mt-0.5">{getSubtitle()}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/progress"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            >
              <FileText className="h-4 w-4"/>
              Progress Log
            </Link>
            <ThemeToggle />
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors px-2 py-2 rounded-lg hover:bg-secondary hover:cursor-pointer">
              <LogOut className="h-4 w-4"/>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {/* Date Toggle */}
        <div className="flex items-center gap-2 mb-6 p-1 rounded-lg bg-secondary/60 w-fit">
          <button
            onClick={() => setSelectedDate(TODAY)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              isToday
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate(YESTERDAY)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              !isToday
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yesterday
          </button>
        </div>

        {/* Score */}
        <div className="mb-6">
          <DayProgress completed={completed} total={total} />
        </div>

        {/* Quest List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {isToday ? "Today's Quests" : "Yesterday's Quests"}
          </h2>
          <AddQuestDialog onAdd={handleAddQuest} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">Loading quests...</p>
          </div>
        ) : (
          <QuestList
            quests={quests}
            isCompleted={(id) => 
              quests.find((q) => q._id === id)?.completed
            }
            onToggle={handleToggleQuest}
            onDelete={handleDeleteQuest}
            onRename={handleRenameQuest}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
