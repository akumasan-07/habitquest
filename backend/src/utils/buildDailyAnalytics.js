import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";

const buildDailyAnalytics = async (userId) => {
  const endDate = new Date();
  endDate.setHours(0,0,0,0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() -364);

  const quests = await Quest.find({
    userId,
  }).select("createdAt");

  const logs = await QuestLog.find({
    userId,
    completed: true,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).select("date");

  const completedMap = new Map();

  logs.forEach((log) => {
    const key = log.date.toISOString().split("T")[0];

    completedMap.set(key, (completedMap.get(key) || 0) +1);
  });

  const days = [];

  for(let i=0; i<365; i++){
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() +i);

    const dateKey = currentDate.toISOString().split("T")[0];

    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const total = quests.filter(
      (quest) => quest.createdAt <= endOfDay
    ).length;

    days.push({
      date: dateKey,
      completed: completedMap.get(dateKey) || 0,
      total,
    });
  }

  return days;
};

export default buildDailyAnalytics;