import { apiClient } from "./client";

const BASE = "/api/util";

export const getHistory = async () => {
  try {
    const data = await apiClient(`${BASE}/history`);
    return data.history;
  } catch {
    return [];
  }
};

export const setHistory = async (history) => {
  return apiClient(`${BASE}/history`, {
    method: "POST",
    body: { history },
  });
};

export const getTheme = async () => {
  try {
    const data = await apiClient(`${BASE}/theme`);
    return data.themeIndex;
  } catch {
    return 0;
  }
};

export const setTheme = async (themeIndex) => {
  return apiClient(`${BASE}/theme`, {
    method: "POST",
    body: { themeIndex },
  });
};
