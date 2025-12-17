// src/api/secureFetch.js
import { getAuth } from "firebase/auth";

/**
 * Wrapper for fetch that automatically adds Firebase auth token and JSON headers.
 * @param {string} url - endpoint URL
 * @param {object} options - fetch options { method, headers, body }
 * @returns {Promise<Response>}
 */
export const secureFetch = async (url, options = {}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User not logged in");

    const token = await user.getIdToken();

    const { body, headers, ...rest } = options;

    return fetch(url, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined, // stringify only if body exists
    });
};
