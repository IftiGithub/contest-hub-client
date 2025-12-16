import { secureFetch } from "../api/secureFetch";
// Fetch contests user participated in
export const getParticipatedContests = async (email) => {
    const res = await secureFetch(`http://localhost:3000/participated-contests/${email}`);
    return res.json();
};

// Fetch contests user won
export const getWinningContests = async (email) => {
    const res = await secureFetch(`http://localhost:3000/winning-contests/${email}`);
    return res.json();
};

export const getCreatorContests = async (email) => {
    const res = await secureFetch(`http://localhost:3000/contests/creator/${email}`);
    return res.json();
};

export const getAllContestsAdmin = async () => {
    const res = await secureFetch("http://localhost:3000/admin/contests");
    return res.json();
};

export const updateContestStatus = async (id, status) => {
    const res = await secureFetch(`http://localhost:3000/admin/contests/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
    });
    return res.json();
};

export const deleteContest = async (id) => {
    const res = await secureFetch(`http://localhost:3000/admin/contests/${id}`, {
        method: "DELETE",
    });
    return res.json();
};

const API = "http://localhost:3000";

// ✅ Approved contests (All)
export const getApprovedContests = async () => {
    const res = await fetch(`${API}/contests`);
    if (!res.ok) throw new Error("Failed to fetch contests");
    return res.json();
};

// ✅ Popular contests (Top 5)
export const getPopularContests = async () => {
    const res = await fetch(`${API}/contests/popular`);
    if (!res.ok) throw new Error("Failed to fetch popular contests");
    return res.json();
};

// ✅ Search by contest type
export const searchContests = async (type) => {
    const res = await fetch(`${API}/contests/search?type=${type}`);
    if (!res.ok) throw new Error("Search failed");
    return res.json();
};
// 🔹 Get contest by ID (for ContestDetails)
export const getContestById = async (id) => {
    const res = await fetch(`${API}/contests/${id}`);
    if (!res.ok) throw new Error("Failed to fetch contest details");
    return res.json();
};


