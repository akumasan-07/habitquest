import { useState } from "react";
import { Link } from "react-router-dom";
import { format, subDays } from "date-fns";
import { useQuestsManager } from "@/hooks/useQuestsManager";
import QuestList from "@/components/QuestList";
import AddQuestDialog from "@/components/AddQuestDialog";
import DayProgress from "@/components/DayProgress";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {FileText} from "lucide-react";

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
  const { quests, addQuest, deleteQuest, renameQuest, toggleQuest, isCompleted } = useQuestsManager();
  const [selectedDate, setSelectedDate] = useState(TODAY);

  const isToday = selectedDate === TODAY;
  const completed = quests.filter((q) => isCompleted(q.id, selectedDate)).length;
  const total = quests.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 md:py-10 px-10 lg:px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl max-sm:text-xl font-bold">{getGreeting()}, Adventurer ⚔️</h1>
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
          quests={quests}
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
