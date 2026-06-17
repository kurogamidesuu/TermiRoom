import { apiClient } from "./client";

const BASE = "/api/user";

export const checkAuth = async () => {
  try {
    return await apiClient(`${BASE}/auth/check`);
  } catch {
    return null;
  }
};

export const login = (username, password) => {
  return apiClient(`${BASE}/login`, {
    method: "POST",
    body: { username, password },
  });
};

export const register = (username, password) => {
  return apiClient(`${BASE}/register`, {
    method: "POST",
    body: { username, password },
  });
};

export const logout = async () => {
  return apiClient(`${BASE}/auth/logout`, {
    method: "POST",
  });
};
