const TZ = "Asia/Kolkata";
const MS_PER_DAY = 86400000;

/** YYYY-MM-DD in IST */
export function toISTDateKey(date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(date));
}

function startFromKey(key) {
  return new Date(`${key}T00:00:00+05:30`);
}

/** Stable instant for QuestLog.date (today | yesterday) */
export function startOfISTDay(day = "today") {
  const todayStart = startFromKey(toISTDateKey(new Date()));
  if (day === "yesterday") {
    return new Date(todayStart.getTime() - MS_PER_DAY);
  }
  return todayStart;
}

export function startOfISTDayFromKey(key) {
  return startFromKey(key);
}

export function endOfISTDayFromKey(key) {
  return new Date(startFromKey(key).getTime() + MS_PER_DAY - 1);
}
