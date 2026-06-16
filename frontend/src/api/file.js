const BASE = "/api/file";

export const getPath = async (currDir) => {
  const res = await fetch(`${BASE}/path?currDir=${currDir}`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.pathArr;
};

export const getNode = async (id) => {
  const res = await fetch(`${BASE}/node/${id}`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.node;
};

export const getChildren = async (id) => {
  const res = await fetch(`${BASE}/node/${id}/children`, {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.children;
};

export const createNode = async (name, type, currDir) => {
  const res = await fetch(`${BASE}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, type, currDir }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(res.error || "Failed to create node.");
  }
  return data.node;
};

export const cd = async (dirArray, currDir) => {
  const res = await fetch(`${BASE}/cd`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ dirArray, currDir }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to change directory.");
  }
  return data; // { currDir: newId, pathArr }
};
