import { useEffect, useState } from "react";
import { getQuests } from "@/lib/questApi";


export const useQuestData = (day) => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuests = async () => {
      setLoading(true);
      setQuests([]);
      setError("");

      try {
        const data = await getQuests(day);
        setQuests(
          data.map((quest) => ({
            ...quest,
            id: quest._id,
          }))
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load quests");
      } finally {
        setLoading(false);
      }
    };

    loadQuests();
  }, [day]);

  return {
    quests,
    setQuests,
    loading,
    error,
  };
};
