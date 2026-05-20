import { format, subDays, differenceInCalendarDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";

export const todayStr = () => format(new Date(), "yyyy-MM-dd");

export const getProductivityScore = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getStreaks = (questId, logs) => {
  const questLogs = logs
    .filter((l) => l.questId === questId && l.completed)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (questLogs.length === 0) return { current: 0, best: 0 };

  let current = 0;
  let best = 0;
  let streak = 0;
  const today = todayStr();

  for (let i = 0; i < 365; i++) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (questLogs.includes(d)) {
      current++;
    } else if (d !== today) {
      break;
    }
  }

  const sorted = [...new Set(questLogs)].sort();
  streak = 1;
  best = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(new Date(sorted[i]), new Date(sorted[i - 1]));
    if (diff === 1) {
      streak++;
      best = Math.max(best, streak);
    } else {
      streak = 1;
    }
  }
  if (sorted.length === 0) best = 0;

  return { current, best };
};

export const getCompletionRate = (questId, logs, quests) => {
  const quest = quests.find((q) => q.id === questId);
  if (!quest) return 0;
  const daysSinceCreation = differenceInCalendarDays(new Date(), new Date(quest.createdAt)) + 1;
  const completedDays = logs.filter((l) => l.questId === questId && l.completed).length;
  return daysSinceCreation > 0 ? Math.min(100, Math.round((completedDays / daysSinceCreation) * 100)) : 0;
};

export const getWeeklySummary = (logs, quests) => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const end = endOfWeek(new Date(), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayLogs = logs.filter((l) => l.date === dateStr && l.completed);
    return {
      day: format(day, "EEE"),
      date: dateStr,
      completed: dayLogs.length,
      total: quests.length,
      isToday: isToday(day),
    };
  });
};

export const getHeatmapData = (logs, quests, days = 140) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const dayLogs = logs.filter((l) => l.date === date && l.completed);
    data.push({ date, count: dayLogs.length, total: quests.length });
  }
  return data;
};

export const generateId = () => Math.random().toString(36).substring(2, 10);
