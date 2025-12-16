// src/api/secureFetch.js
import { getAuth } from "firebase/auth";
export const secureFetch = async (url, options = {}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const token = user ? await user.getIdToken() : null;

    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
};
