import { getProductivityScore } from "@/lib/questAnalytics";

const DayProgress = ({ completed, total }) => {
  const score = getProductivityScore(completed, total);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-5 p-5 rounded-xl bg-card border border-border">
      <div className="relative h-24 w-24 shrink-0">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold font-mono">{score}%</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Score</p>
        <p className="text-2xl font-bold">
          {completed}<span className="text-muted-foreground text-base font-normal">/{total}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">quests completed</p>
      </div>
    </div>
  );
};

export default DayProgress;
