import api from "./api";

export const getQuestAnalytics = async () => {
  const response = await api.get("/analytics/quests");
  return response.data;
};

export const getHeatmapData = async () => {
  const response = await api.get("/analytics/heatmap");
  return response.data;
};