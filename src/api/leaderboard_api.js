// src/api/leaderboard_api.js

import { secureFetch } from "./secureFetch";

const API = "http://localhost:3000"; // backend URL

/**
 * Fetch paginated leaderboard.
 * Backend must return: { users: [...], totalCount: X }
 * @param {number} page - page number (1-indexed)
 * @param {number} limit - number of items per page
 */
export const fetchLeaderboard = async (page = 1, limit = 10) => {
  return await secureFetch(`${API}/leaderboard?page=${page}&limit=${limit}`);
};
