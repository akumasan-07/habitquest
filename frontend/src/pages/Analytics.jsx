import { useState } from "react";
import { useQuestsManager } from "@/hooks/useQuestsManager";
import { getStreaks, getCompletionRate, getWeeklySummary, getHeatmapData } from "@/lib/questUtils";
import QuestHeatmap from "@/components/QuestHeatmap";
import { Link } from "react-router-dom";

const Analytics = () => {
  const { quests, logs, resetAll } = useQuestsManager();
  const [showConfirm, setShowConfirm] = useState(false);
  const weekly = getWeeklySummary(logs, quests);
  const heatmapData = getHeatmapData(logs, quests);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[70%] py-8 px-4 mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold flex-1">Quest Log 📜</h1>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" />
            </svg>
            Reset
          </button>
        </div>

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
          <div className="flex gap-2">
            {weekly.map((d) => (
              <div
                key={d.date}
                className={`flex-1 rounded-lg p-3 text-center border transition-all ${
                  d.isToday ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                <p className="text-xs text-muted-foreground">{d.day}</p>
                <p className="text-lg font-bold font-mono mt-1">
                  {d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0}
                </p>
                <p className="text-[10px] text-muted-foreground">XP</p>
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
                    <p className="font-medium text-sm mb-2">{quest.title}</p>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>
                        <span>{current} day streak</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <svg className="h-3.5 w-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
                        <span>Record: {best}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
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

export default Analytics;
