import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Flame, TrendingUp, Trophy } from "lucide-react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday } from "date-fns";
import QuestHeatmap from "@/components/QuestHeatmap";
import ThemeToggle from "@/components/ThemeToggle";
import { getQuestAnalytics, getHeatmapData } from "@/lib/analyticsApi";

const Progress = () => {
  const [questAnalytics, setQuestAnalytics] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const weekly = eachDayOfInterval({
    start: startOfWeek(new Date(), {weekStartsOn: 1}),
    end: endOfWeek(new Date(), { weekStartsOn: 1}),
  }).map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayData = heatmapData.find(
      (d) => d.date === dateStr
    );
    
    return {
      day: format(day, "EEE"),
      date: dateStr,
      completed: dayData?.completed || 0,
      total: dayData?.total || 0,
      isToday: isToday(day),
    };
  });
  
  //----------- load analytics --------------
  useEffect(() => {
    const loadAnalytics = async () => {
      try{
        const [questData, heatmap] = await Promise.all([
          getQuestAnalytics(),
          getHeatmapData(),
        ]);

        setQuestAnalytics(questData);
        setHeatmapData(heatmap);
        setError("");

      }catch(error){
        console.error(error);
        setError("Failed to load progress data. Please try again later.");

      }finally{
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 md:py-10 px-10 lg:px-4 mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold flex-1">Progress Log 📜</h1>
          <ThemeToggle />
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">
              {error}
            </p>
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
          {questAnalytics.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quests yet</p>
          ) : (
            <div className="space-y-3">
              {questAnalytics.map((quest) => {
                
                return (
                  <div key={quest.questId} className="p-4 rounded-lg bg-card border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-sm">{quest.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Started: {new Date(quest.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Flame className="h-3.5 w-3.5 text-accent"/>
                        <span>{quest.currentStreak} day streak</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Trophy className="h-3.5 w-3.5 text-accent"/>
                        <span>Record: {quest.bestStreak}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-primary"/>
                        <span>{quest.consistency}% consistency</span>
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
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">ADVENTURE LOG (PAST 6 MONTHS)</h2>
          <div className="p-4 rounded-lg bg-card border border-border">
            <QuestHeatmap data={heatmapData} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;
