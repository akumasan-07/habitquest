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

const WEEK_WIDTH = 17;

const QuestHeatmap = ({ data }) => {
  const [tooltip, setTooltip] = useState(null);
  
  if(!data || data.length === 0){
    return null;
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() -182);

  const filteredData = data.filter(
    (day) => new Date(day.date) >= sixMonthsAgo
  );

  const firstDate = new Date(filteredData[0].date);
  const dayOfWeek = (firstDate.getDay() + 6) %7;

  const paddedData = [
    ...Array(dayOfWeek).fill(null),
    ...filteredData,
  ];

  const weeks = [];

  for(let i=0; i<paddedData.length; i+=7){
    weeks.push(paddedData.slice(i, i+7));
  }

  const monthLabels = [];
  let lastMonth = null;
  weeks.forEach((week, index) => {
    const firstNewMonthDay = week.find((day) => {
      if(!day) return false;

      const currentMonth = format(new Date(day.date), "MMM");

      if (currentMonth !== lastMonth) {
        lastMonth = currentMonth;
        return true;
      }
      return false;
    });

    if (firstNewMonthDay) {
      monthLabels.push({
        month: format(new Date(firstNewMonthDay.date), "MMM"),
        index,
      });
    }
  });

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-2">
        <div className="relative h-4 ml-14 mb-2 text-xs text-muted-foreground">
          {monthLabels.map((label) => (
            <span
              key={label.month + label.index}
              className="absolute"
              style={{
                left: `${label.index * WEEK_WIDTH}px`,
              }}
            >
              {label.month}
            </span>
          ))}
        </div>

        <div className="flex gap-[5px]">
          <div className="flex flex-col gap-[6px] text-xs text-muted-foreground pr-2 mr-4">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="h-3 flex items-center"
              >
                {label}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[6px]">
              {week.map((day, di) => {
                if(!day) {
                  return <div key={di} className="h-3 w-3" />;
                }
                
                return (
                  <div
                    key={day.date}
                    className={cn(
                      "h-3 w-3 rounded-sm cursor-pointer transition-transform hover:scale-125",
                      getLevel(day.completed, day.total)
                    )}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        text: `${format(new Date(day.date), "MMM d, yyyy")}: ${day.completed}/${day.total} quests completed`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
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
