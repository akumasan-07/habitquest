import {
  toDateKey,
  startOfDay,
  startOfDayFromKey,
  MS_PER_DAY,
} from "./dateUtils.js";

const calculateCurrentStreak = (completedDates, timeZone) => {
  let currentStreak = 0;
  const todayStr = toDateKey(new Date(), timeZone);
  let check = completedDates.has(todayStr)
    ? startOfDayFromKey(todayStr, timeZone)
    : new Date(startOfDay("today", timeZone).getTime() - MS_PER_DAY);

  while (completedDates.has(toDateKey(check, timeZone))) {
    currentStreak++;
    check = new Date(check.getTime() - MS_PER_DAY);
  }

  return currentStreak;
};

export default calculateCurrentStreak;
