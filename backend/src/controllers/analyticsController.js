import buildDailyAnalytics from "../utils/buildDailyAnalytics.js";

export const getHeatmapData = async (req, res) => {
  try {
    const days = await buildDailyAnalytics(req.user.userId);
    
    res.status(200).json(days);

  }catch(error){
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const getStreaks = async (req, res) => {
  try{
    const days = await buildDailyAnalytics(req.user.userId);

    let currentStreak = 0;
    let bestStreak = 0;
    let runningStreak = 0;

    days.forEach((day) => {
      const perfectDay = (day.total > 0) && (day.completed === day.total);

      if(perfectDay){
        runningStreak++;

        if(runningStreak > bestStreak){
          bestStreak = runningStreak;
        }
      }else{
        runningStreak = 0;
      }
    });

    for(let i = days.length-1; i>=0; i--){
      const day = days[i];

      const perfectDay = (day.total > 0) && (day.completed === day.total);
      if(!perfectDay){
        break;
      }
      currentStreak++;
    }

    res.status(200).json({
      currentStreak,
      bestStreak,
    });
  }catch(error){
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

