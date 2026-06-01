import api from "./api";

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};


export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};


export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};


export const deleteAccount = async (password) => {
  const { data } = await api.delete("/auth/account", 
    {
      data: {password},
    }
  );

  return data;
};