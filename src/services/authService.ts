import api from "../api/authInstance";


export const loginService = async (username: string, password: string) => {
  const response = await api.post("/Auth/Login", {
    username,
    password,
  });

  return response.data; // expects { token, user }
};

export const registerService = async (body: any) => {
  const response = await api.post("/Auth/Register", body);
  return response.data;
};

export const getProfileService = async () => {
  const response = await api.get("/Auth/Profile");
  return response.data;
};

export const logoutService = async () => {
  localStorage.removeItem("token");
  return true;
};
