import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const getLevel = (count, total) => {
  if (count === 0) return "bg-heatmap-empty";
  const ratio = total > 0 ? count / total : 0;
  if (ratio <= 0.25) return "bg-heatmap-low";
  if (ratio <= 0.5) return "bg-heatmap-mid";
  if (ratio <= 0.75) return "bg-heatmap-high";
  return "bg-heatmap-max";
};

const QuestHeatmap = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="relative">
      <div className="flex gap-[3px] overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                className={cn(
                  "h-3 w-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                  getLevel(day.count, day.total)
                )}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 8,
                    text: `${format(new Date(day.date), "MMM d, yyyy")}: ${day.count} quests conquered`,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>
      {tooltip && (
        <div
          className="fixed z-50 px-2.5 py-1.5 rounded-md bg-foreground text-background text-xs font-medium pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
      <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-heatmap-empty" />
        <div className="h-3 w-3 rounded-sm bg-heatmap-low" />
        <div className="h-3 w-3 rounded-sm bg-heatmap-mid" />
        <div className="h-3 w-3 rounded-sm bg-heatmap-high" />
        <div className="h-3 w-3 rounded-sm bg-heatmap-max" />
        <span>More</span>
      </div>
    </div>
  );
};

export default QuestHeatmap;
