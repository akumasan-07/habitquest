import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";
import {
  toISTDateKey,
  startOfISTDayFromKey,
  endOfISTDayFromKey,
} from "./istDay.js";

const MS_PER_DAY = 86400000;

const buildDailyAnalytics = async (userId) => {
  const endKey = toISTDateKey(new Date());
  const rangeEnd = endOfISTDayFromKey(endKey);
  const rangeStart = new Date(
    startOfISTDayFromKey(endKey).getTime() - 364 * MS_PER_DAY
  );

  const quests = await Quest.find({
    userId,
  }).select("createdAt");

  const logs = await QuestLog.find({
    userId,
    completed: true,
    date: {
      $gte: rangeStart,
      $lte: rangeEnd,
    },
  }).select("date");

  const completedMap = new Map();

  logs.forEach((log) => {
    const key = toISTDateKey(log.date);

    completedMap.set(key, (completedMap.get(key) || 0) + 1);
  });

  const days = [];
  let dayStart = rangeStart;

  for (let i = 0; i < 365; i++) {
    const dateKey = toISTDateKey(dayStart);
    const endOfDay = endOfISTDayFromKey(dateKey);

    const total = quests.filter(
      (quest) => quest.createdAt <= endOfDay
    ).length;

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
