import Quest from "../models/Quest.js";
import QuestLog from "../models/QuestLog.js";
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


export const getQuestAnalytics = async (req, res) => {
  try{
    const quests = await Quest.find({
      userId: req.user.userId,
    }).sort({createdAt: -1});

    const logs = await QuestLog.find({
      userId: req.user.userId,
    })
    .select("questId date completed")
    .sort({date:1});

    const logsByQuest = new Map();

    logs.forEach((log) => {
      const questId = log.questId.toString();
      if(!logsByQuest.has(questId)){
        logsByQuest.set(questId, []);
      }

      logsByQuest.get(questId).push(log);
    });

    const analytics = quests.map((quest) => {
      const questLogs = logsByQuest.get(quest._id.toString()) || [];

      const createdDate = new Date(quest.createdAt);
      createdDate.setHours(0,0,0,0);

      const today = new Date();
      today.setHours(0,0,0,0);
      
      const daysSinceCreation = Math.floor(
        (today-createdDate) / (1000*60*60*24)
      )+1;

      const completedDays = questLogs.filter((log) => log.completed).length;

      //--------------- Consistency ------------------
      const consistency = Math.min(
        100,
        Math.round((completedDays/daysSinceCreation)*100)
      );

      const completedDates = new Set(
        questLogs
        .filter((log) => log.completed)
        .map((log) => {
          const date = new Date(log.date);
          date.setHours(0,0,0,0);
          return date.toISOString().split("T")[0];
        })
      );

      //-------------- Current Streak -----------------
      let currentStreak = 0;
      const checkDate = new Date();
      checkDate.setHours(0,0,0,0);

      while(true){
        const dateStr = checkDate.toISOString().split("T")[0];

        if(!completedDates.has(dateStr)){
          break;
        }

        currentStreak++;

        checkDate.setDate(checkDate.getDate()-1);
      }

      // ------------- Best Streak --------------------
      const sortedDates = [...completedDates].sort();
      let bestStreak = 0;
      let runningStreak = 0;
      let previousDate = null;

      sortedDates.forEach((dateStr) => {
        const currentDate = new Date(dateStr);
        if(!previousDate){
          runningStreak = 1;
        }else{
          const diffDays = (currentDate - previousDate)/(1000*60*60*24);
          if(diffDays === 1){
            runningStreak++;
          }else{
            runningStreak=1;
          }
        }

        if(runningStreak > bestStreak){
          bestStreak = runningStreak;
        }

        previousDate = currentDate;
      });

      return {
        questId: quest._id,
        title: quest.title,
        createdAt: quest.createdAt,
        consistency,
        currentStreak,
        bestStreak,
      };
    });

    res.status(200).json(analytics);

  }catch(error){
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};