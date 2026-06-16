const BASE = "/api/user";

export const getProfile = async () => {
  const res = await fetch(`${BASE}/profile`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json(); // { username, id, storageQuota, usedSpace }
};

export const updateUsername = async (newUsername) => {
  const res = await fetch(`${BASE}/profile/username`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ newUsername }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update username.");
  }
  return data.username;
};
