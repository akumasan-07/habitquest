import { useState, useEffect, useCallback } from "react";
import { todayStr, generateId } from "@/lib/questAnalytics";

const QUESTS_KEY = "pt_quests";
const LOGS_KEY = "pt_quest_logs";

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useQuestsManager = () => {
  const [quests, setQuests] = useState(() => load(QUESTS_KEY, []));
  const [logs, setLogs] = useState(() => load(LOGS_KEY, []));

  useEffect(() => localStorage.setItem(QUESTS_KEY, JSON.stringify(quests)), [quests]);
  useEffect(() => localStorage.setItem(LOGS_KEY, JSON.stringify(logs)), [logs]);

  const addQuest = useCallback((title) => {
    const archived = quests.find(
      (q) => q.archivedAt && q.title.toLowerCase() === title.toLowerCase()
    );
    if (archived) {
      setQuests((prev) =>
        prev.map((q) => (q.id === archived.id ? { ...q, archivedAt: undefined } : q))
      );
    } else {
      const quest = { id: generateId(), title, createdAt: todayStr() };
      setQuests((prev) => [...prev, quest]);
    }
  }, [quests]);

  const deleteQuest = useCallback((id) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, archivedAt: todayStr() } : q))
    );
  }, []);

  const renameQuest = useCallback((id, newTitle) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    );
  }, []);

  const activeQuests = quests.filter((q) => !q.archivedAt);

  const toggleQuest = useCallback((questId, date) => {
    const d = date || todayStr();
    setLogs((prev) => {
      const existing = prev.find((l) => l.questId === questId && l.date === d);
      if (existing) {
        return existing.completed
          ? prev.filter((l) => l.id !== existing.id)
          : prev.map((l) => (l.id === existing.id ? { ...l, completed: true } : l));
      }
      return [...prev, { id: generateId(), questId, date: d, completed: true }];
    });
  }, []);

  const isCompleted = useCallback(
    (questId, date) => {
      const d = date || todayStr();
      return logs.some((l) => l.questId === questId && l.date === d && l.completed);
    },
    [logs]
  );

  const todayStats = useCallback(() => {
    const today = todayStr();
    const completed = activeQuests.filter((q) => isCompleted(q.id, today)).length;
    return { completed, total: activeQuests.length };
  }, [activeQuests, isCompleted]);

  const resetAll = useCallback(() => {
    setQuests([]);
    setLogs([]);
    localStorage.removeItem(QUESTS_KEY);
    localStorage.removeItem(LOGS_KEY);
  }, []);

  return {
    quests,
    activeQuests,
    logs,
    addQuest,
    deleteQuest,
    renameQuest,
    toggleQuest,
    isCompleted,
    todayStats,
    resetAll,
  };
};
