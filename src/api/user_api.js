import { secureFetch } from "../api/secureFetch";
export const saveUser = async (user) => {
    const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
    };

    const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(userInfo),
    });

    return res.json();
};

export const getUserByEmail = async (email) => {
    const res = await secureFetch(`http://localhost:3000/users/${email}`);

    if (!res.ok) {
        // if 404, return null instead of throwing
        return null;
    }

    return res.json();
};

export const updateUser = async (email, updatedData) => {
    const res = await secureFetch(`http://localhost:3000/users/${email}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    return res.json();
};
const API = "http://localhost:3000";

// 🔥 Get all users
export const getAllUsers = async () => {
    const res = await secureFetch(`${API}/admin/users`);
    return res.json();
};

// 🔥 Update user role
export const updateUserRole = async ({ id, role }) => {
    const res = await secureFetch(`${API}/admin/users/role/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
    });
    return res.json();
};



