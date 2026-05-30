import { useState } from "react";
import { useQuestsManager } from "@/hooks/useQuestsManager";
import { getStreaks, getCompletionRate, getWeeklySummary, getHeatmapData } from "@/lib/questAnalytics";
import QuestHeatmap from "@/components/QuestHeatmap";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, Flame, RefreshCcw, RefreshCw, TrendingUp, Trophy } from "lucide-react";

const Progress = () => {
  const { quests, logs, resetAll } = useQuestsManager();
  const [showConfirm, setShowConfirm] = useState(false);
  const weekly = getWeeklySummary(logs, quests);
  const heatmapData = getHeatmapData(logs, quests);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 md:py-10 px-10 lg:px-4 mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold flex-1">Progress Log 📜</h1>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10 hover:cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <ThemeToggle />
        </div>

        {/* Reset Confirmation */}
        {showConfirm && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <p className="text-sm font-medium mb-3">Wipe all quest data? This cannot be undone ⚠️</p>
            <div className="flex gap-2">
              <button
                onClick={() => { resetAll(); setShowConfirm(false); }}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">THIS WEEK'S LOG</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {weekly.map((d) => (
              <div
                key={d.date}
                className={`flex-1 rounded-lg p-3 text-center border transition-all ${
                  d.isToday ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <p className="text-sm text-muted-foreground">{d.day}</p>
                <p className="text-lg font-bold font-mono">
                  <span className="ml-2"></span>
                  {d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0}
                  <span className="text-sm ml-1 text-muted-foreground">%</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quest Streaks */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quest Streaks 🔥</h2>
          {quests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quests yet</p>
          ) : (
            <div className="space-y-3">
              {quests.map((quest) => {
                const { current, best } = getStreaks(quest.id, logs);
                const rate = getCompletionRate(quest.id, logs, quests);
                return (
                  <div key={quest.id} className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-sm">{quest.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Started: {quest.createdAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Flame className="h-3.5 w-3.5 text-accent"/>
                        <span>{current} day streak</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Trophy className="h-3.5 w-3.5 text-accent"/>
                        <span>Record: {best}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-primary"/>
                        <span>{rate}% consistency</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Heatmap */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">ADVENTURE LOG (LAST 20 WEEKS)</h2>
          <div className="p-4 rounded-lg bg-card border border-border">
            <QuestHeatmap data={heatmapData} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;
