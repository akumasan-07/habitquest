import api from "./api";

export const getQuests = async (day) => {
  const response = await api.get(`/quests?day=${day}`);

  return response.data;
};

export const addQuest = async (title) => {
  const response = await api.post("/quests", {title});

  return response.data;
};

export const renameQuest = async (id, title) => {
  const response = await api.patch(`/quests/${id}`, {title});

  return response.data;
};

export const deleteQuest = async (id) => {
  const response = await api.delete(`/quests/${id}`);

  return response.data;
};

export const toggleQuest = async (id, day) => {
  const response = await api.post(`/quests/${id}/toggle`, {day});

  return response.data;
};