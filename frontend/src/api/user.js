import { apiClient } from "./client";

const BASE = "/api/user";

export const getProfile = async () => {
  try {
    return await apiClient(`${BASE}/profile`);
  } catch {
    return null;
  }
};

export const updateUsername = async (newUsername) => {
  const data = await apiClient(`${BASE}/profile/username`, {
    method: "PATCH",
    body: { newUsername },
  });
  return data.username;
};
