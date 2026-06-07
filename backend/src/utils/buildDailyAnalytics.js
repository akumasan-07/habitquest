import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";
import {
  toDateKey,
  startOfDayFromKey,
  endOfDayFromKey,
  MS_PER_DAY,
} from "./dateUtils.js";

const buildDailyAnalytics = async (userId, timeZone) => {
  const endKey = toDateKey(new Date(), timeZone);
  const rangeEnd = endOfDayFromKey(endKey, timeZone);
  const rangeStart = new Date(
    startOfDayFromKey(endKey, timeZone).getTime() - 364 * MS_PER_DAY
  );

  const [quests, logs] = await Promise.all([
    Quest.find({
      userId,
    })
    .select("createdAt")
    .lean(),

    QuestLog.find({
      userId,
      completed: true,
      date: {
        $gte: rangeStart,
        $lte: rangeEnd,
      },
    })
    .select("date")
    .lean(),
  ]);

  const completedMap = new Map();

  logs.forEach((log) => {
    const key = toDateKey(log.date, timeZone);
    completedMap.set(key, (completedMap.get(key) || 0) + 1);
  });

  const days = [];
  let dayStart = rangeStart;

  const questCreationDates = quests
    .map((q) => q.createdAt)
    .sort((a, b) => a-b);
  
  let activeQuestCount = 0;
  let questIndex = 0;

  for (let i = 0; i < 365; i++) {
    const dateKey = toDateKey(dayStart, timeZone);
    const endOfDay = endOfDayFromKey(dateKey, timeZone);

    while(
      questIndex < questCreationDates.length &&
      questCreationDates[questIndex] <= endOfDay
    ){
      activeQuestCount++;
      questIndex++;
    }

    const total = activeQuestCount;

    days.push({
      date: dateKey,
      completed: completedMap.get(dateKey) || 0,
      total,
    });

    dayStart = new Date(dayStart.getTime() + MS_PER_DAY);
  }

  return days;
};

export default buildDailyAnalytics;
