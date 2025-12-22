import { secureFetch } from "../api/secureFetch";

const API = "http://localhost:3000";

// ===== User Contests =====

// Fetch contests the user participated in
export const getParticipatedContests = async (email) => {
  if (!email) return [];
  return await secureFetch(`${API}/participated-contests/${email}`);
};

// Fetch contests the user won
export const getWinningContests = async (email) => {
  if (!email) return [];
  return await secureFetch(`${API}/winning-contests/${email}`);
};

// Fetch contests created by the user
export const getCreatorContests = async (email) => {
  if (!email) return [];
  return await secureFetch(`${API}/contests/creator/${email}`);
};

// Update a contest created by the user
export const updateCreatorContest = async (id, data) => {
  return await secureFetch(`${API}/contests/${id}`, {
    method: "PATCH",
    body: data, // secureFetch handles JSON.stringify
  });
};

// Delete a contest created by the user
export const deleteCreatorContest = async (id) => {
  return await secureFetch(`${API}/contests/${id}`, {
    method: "DELETE",
  });
};

// ===== Admin Contests =====

// Get all contests for admin
export const getAllContestsAdmin = async () => {
  return await secureFetch(`${API}/admin/contests`);
};

// Update contest status (approve/reject)
export const updateContestStatus = async (id, status) => {
  return await secureFetch(`${API}/admin/contests/${id}`, {
    method: "PATCH",
    body: { status },
  });
};

// Delete contest (admin)
export const deleteContest = async (id) => {
  return await secureFetch(`${API}/admin/contests/${id}`, {
    method: "DELETE",
  });
};

// ===== Public Contests =====

// Get all approved contests (no auth needed)
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
  return await secureFetch(`${API}/contests/${id}`);
};

// Fetch submissions for a contest (creator only)
export const getSubmissions = async (contestId) => {
  return await secureFetch(`${API}/contests/submissions/${contestId}`);
};
// Declare winner for a contest (creator only)
export const declareWinner = async (contestId, winnerEmail) => {
  if (!contestId || !winnerEmail) throw new Error("Contest ID and winner email are required");

  return await secureFetch(`${API}/contests/declare-winner/${contestId}`, {
    method: "PATCH",
    body: { winnerEmail }, // send winnerEmail in request body
  });
};
// ===== Winner Advertisement =====
export const getRecentWinners = async () => {
  const res = await fetch("http://localhost:3000/contests/winners");
  if (!res.ok) throw new Error("Failed to fetch winners");
  return res.json();
};

