export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const MS_PER_DAY = 86400000;
const formatterCache = new Map();

export function isValidTimeZone(timeZone) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** YYYY-MM-DD for the given instant in the user's timezone */
export function toDateKey(date, timeZone) {
  let formatter = formatterCache.get(timeZone);

  if(!formatter){
    formatter = new Intl.DateTimeFormat("en-CA", {timeZone});
    formatterCache.set(timeZone, formatter);
  }

  return formatter.format(new Date(date));
}

/** UTC instant for 00:00:00 on dateKey in timeZone */
export function startOfDayFromKey(dateKey, timeZone) {
  const [y, m, d] = dateKey.split("-").map(Number);
  let low = Date.UTC(y, m - 1, d - 1, 0, 0, 0);
  let high = Date.UTC(y, m - 1, d + 1, 23, 59, 59);

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const key = toDateKey(new Date(mid), timeZone);
    if (key < dateKey) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return new Date(low);
}

export function endOfDayFromKey(dateKey, timeZone) {
  const nextKey = addDaysToKey(dateKey, 1, timeZone);
  return new Date(startOfDayFromKey(nextKey, timeZone).getTime() - 1);
}

export function addDaysToKey(dateKey, days, timeZone) {
  const start = startOfDayFromKey(dateKey, timeZone);
  return toDateKey(new Date(start.getTime() + days * MS_PER_DAY), timeZone);
}

/** Stable instant for QuestLog.date (today | yesterday) in the user's timezone */
export function startOfDay(day, timeZone) {
  const todayKey = toDateKey(new Date(), timeZone);
  if (day === "yesterday") {
    const yesterdayKey = addDaysToKey(todayKey, -1, timeZone);
    return startOfDayFromKey(yesterdayKey, timeZone);
  }
  return startOfDayFromKey(todayKey, timeZone);
}
