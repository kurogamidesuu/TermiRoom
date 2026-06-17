import { apiClient } from "./client";

const BASE = "/api/file";

export const getPath = async (currDir) => {
  try {
    const data = await apiClient(`${BASE}/path?currDir=${currDir}`);
    return data.pathArr;
  } catch {
    return [];
  }
};

export const getNode = async (id) => {
  try {
    const data = await apiClient(`${BASE}/node/${id}`);
    return data.node;
  } catch {
    return null;
  }
};

export const getChildren = async (id) => {
  try {
    const data = await apiClient(`${BASE}/node/${id}/children`);
    return data.children;
  } catch {
    return [];
  }
};

export const createNode = async (name, type, currDir) => {
  const data = await apiClient(`${BASE}/create`, {
    method: "POST",
    body: { name, type, currDir },
  });
  return data.node;
};

export const cd = (dirArray, currDir) => {
  return apiClient(`${BASE}/cd`, {
    method: "PATCH",
    body: { dirArray, currDir },
  });
};
