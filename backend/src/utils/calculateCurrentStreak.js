const calculateCurrentStreak = (completedDates) => {
  let currentStreak = 0;

  const today = new Date();
  today.setHours(0,0,0,0);

  const todayStr = today.toISOString().split("T")[0];
  const checkDate = new Date(today);

  if(!completedDates.has(todayStr)){
    checkDate.setDate(checkDate.getDate()-1);
  }

  while(true){
    const dateStr = checkDate.toISOString().split("T")[0];

    if(!completedDates.has(dateStr)){
      break;
    }
    currentStreak++;
    checkDate.setDate(checkDate.getDate()-1);
  }

  return currentStreak;
};

export default calculateCurrentStreak;