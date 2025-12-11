import api from "../api/authInstance";

export const loginService = async (username: string, password: string) => {
  const response = await api.post("/Auth/Login", { username, password });

  console.log("=== AUTH SERVICE - AFTER API CALL ===");
  console.log("Full axios response:", response);
  console.log("Response.data:", response.data);

  const token = response.data.accessToken;
  const refreshToken = response.data.refreshToken;

  console.log("Mapped token:", token);

  return {
    token,
    refreshToken,
    user: response.data.user ?? null
  };
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
