import { useState } from "react";
import { Link } from "react-router-dom";
import { format, subDays } from "date-fns";
import { useQuestsManager } from "@/hooks/useQuestsManager";
import QuestList from "@/components/QuestList";
import AddQuestDialog from "@/components/AddQuestDialog";
import DayProgress from "@/components/DayProgress";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Rise and Grind";
  if (h < 17) return "Good Afternoon";
  if (h < 21) return "Good Evening";
  return "Time to Wrap Up";
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
  const { activeQuests, addQuest, deleteQuest, renameQuest, toggleQuest, isCompleted } = useQuestsManager();
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const isToday = selectedDate === TODAY;
  const completed = activeQuests.filter((q) => isCompleted(q.id, selectedDate)).length;
  const total = activeQuests.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[70%] py-10 px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}, Adventurer ⚔️</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{getSubtitle()}</p>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/progress"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Quest Log
            </Link>
            <ThemeToggle />
          </div>
        </div>

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
          <AddQuestDialog onAdd={addQuest} />
        </div>

        <QuestList
          quests={activeQuests}
          isCompleted={(id) => isCompleted(id, selectedDate)}
          onToggle={(id) => toggleQuest(id, selectedDate)}
          onDelete={deleteQuest}
          onRename={renameQuest}
        />
      </div>
    </div>
  );
};

export default Dashboard;
