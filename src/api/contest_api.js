import { secureFetch } from "../api/secureFetch";

const API = "http://localhost:3000";

// ===== User Contests =====

// Fetch contests the user participated in
export const getParticipatedContests = async (email) => {
    const res = await secureFetch(`${API}/participated-contests/${email}`);
    return res.json();
};

// Fetch contests the user won
export const getWinningContests = async (email) => {
    const res = await secureFetch(`${API}/winning-contests/${email}`);
    return res.json();
};

// Fetch contests created by the user
export const getCreatorContests = async (email) => {
    const res = await secureFetch(`${API}/contests/creator/${email}`);
    return res.json();
};

// Update a contest created by the user
export const updateCreatorContest = async (id, data) => {
    const res = await secureFetch(`${API}/contests/${id}`, {
        method: "PATCH",
        body: data, // secureFetch handles JSON.stringify
    });
    return res.json();
};

// Delete a contest created by the user
export const deleteCreatorContest = async (id) => {
    const res = await secureFetch(`${API}/contests/${id}`, {
        method: "DELETE",
    });
    return res.json();
};

// ===== Admin Contests =====

// Get all contests for admin
export const getAllContestsAdmin = async () => {
    const res = await secureFetch(`${API}/admin/contests`);
    return res.json();
};

// Update contest status (approve/reject)
export const updateContestStatus = async (id, status) => {
    const res = await secureFetch(`${API}/admin/contests/${id}`, {
        method: "PATCH",
        body: { status },
    });
    return res.json();
};

// Delete contest (admin)
export const deleteContest = async (id) => {
    const res = await secureFetch(`${API}/admin/contests/${id}`, {
        method: "DELETE",
    });
    return res.json();
};

// ===== Public Contests =====

// Get all approved contests
export const getApprovedContests = async () => {
    const res = await fetch(`${API}/contests`);
    if (!res.ok) throw new Error("Failed to fetch contests");
    return res.json();
};

// Get popular contests (top 5)
export const getPopularContests = async () => {
    const res = await fetch(`${API}/contests/popular`);
    if (!res.ok) throw new Error("Failed to fetch popular contests");
    return res.json();
};

// Search contests by type
export const searchContests = async (type) => {
    const res = await fetch(`${API}/contests/search?type=${type}`);
    if (!res.ok) throw new Error("Search failed");
    return res.json();
};

// Get contest by ID (ContestDetails)
export const getContestById = async (id) => {
    const res = await fetch(`${API}/contests/${id}`);
    if (!res.ok) throw new Error("Failed to fetch contest details");
    return res.json();
};
