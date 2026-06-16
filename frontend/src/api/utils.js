const BASE = "/api/util";

export const getHistory = async () => {
  const res = await fetch(`${BASE}/history`, { credentials: "include" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.history;
};

export const setHistory = async (history) => {
  await fetch(`${BASE}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ history }),
  });
};

export const getTheme = async () => {
  const res = await fetch(`${BASE}/theme`, { credentials: "include" });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.themeIndex;
};

export const setTheme = async (themeIndex) => {
  await fetch(`${BASE}/theme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ themeIndex }),
  });
};
