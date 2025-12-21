// src/api/secureFetch.js
import { getAuth } from "firebase/auth";

/**
 * Wrapper for fetch that automatically adds Firebase auth token and returns JSON
 * Works for GET, POST, PATCH, DELETE requests.
 */
export const secureFetch = async (url, options = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("User not logged in");

  const token = await user.getIdToken();

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  try {
    return await res.json();
  } catch (_) {
    return {};
  }
};
