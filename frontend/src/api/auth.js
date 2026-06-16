const BASE = "/api/user";

export const checkAuth = async () => {
  const res = await fetch(`${BASE}/auth/check`, { credentials: "include" });
  if (!res.ok) {
    return null;
  }
  return res.json(); // { authenticated, user: { username, id }, currDir }
};

export const login = async (username, password) => {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed.");
  }
  return data; // { user: { username, id }, currDir }
};

export const register = async (username, password) => {
  const res = await fetch(`${BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed.");
  }
  return data; // { user: { username, id }, currDir }
};

export const logout = async () => {
  await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
