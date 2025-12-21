import { secureFetch } from "../api/secureFetch";
// Save a new user (no auth required)
export const saveUser = async (user) => {
  const userInfo = {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };

  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save user");
  }

  return res.json(); // native fetch returns Response, so we still need .json() here
};

// Get user by email (uses secureFetch, already returns JSON)
export const getUserByEmail = async (email) => {
  try {
    const data = await secureFetch(`http://localhost:3000/users/${email}`);
    return data;
  } catch (err) {
    if (err.message.includes("404")) return null; // user not found
    throw err;
  }
};

// Update user info
export const updateUser = async (email, updatedData) => {
  const data = await secureFetch(`http://localhost:3000/users/${email}`, {
    method: "PUT",
    body: updatedData, // secureFetch handles JSON.stringify
  });

  return data;
};

const API = "http://localhost:3000";

// 🔥 Get all users
export const getAllUsers = async () => {
    const data = await secureFetch(`${API}/admin/users`);
    return data; // already parsed JSON
};


// 🔥 Update user role
export const updateUserRole = async ({ id, role }) => {
    const data = await secureFetch(`${API}/admin/users/role/${id}`, {
        method: "PATCH",
        body: { role }, // pass object directly
    });
    return data; // already JSON
};




