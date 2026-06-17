const API_BASE = import.meta.env.VITE_API_URL || "";

export const apiClient = async (endpoint, options = {}) => {
  const { method = "GET", body, headers, ...customConfig } = options;

  const config = {
    method,
    credentials: "include",
    headers: {
      ...headers,
    },
    ...customConfig,
  };

  if (body) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startswith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, config);

  if (res.status === 401) {
    window.dispatchEvent(new Event("unauthorized"));
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong!");
  }

  return data;
};
