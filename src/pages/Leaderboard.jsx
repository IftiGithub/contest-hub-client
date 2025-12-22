// src/pages/Leaderboard.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { fetchLeaderboard } from "../api/leaderboard_api";

const ITEMS_PER_PAGE = 10;

const Leaderboard = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () => fetchLeaderboard(page, ITEMS_PER_PAGE),
    keepPreviousData: true,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500">
        Failed to load leaderboard
      </p>
    );

  // Updated: data structure from backend
  const users = data?.data || [];
  const totalCount = data?.totalUsers || 0;
  const totalPages = data?.totalPages || 1;

  if (users.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No winners yet.
      </p>
    );

  return (
    <div className="px-4 my-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">🏆 Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th>Rank</th>
              <th>User</th>
              <th>Email</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr
                key={user.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-100"
              >
                <td>{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td className="flex items-center gap-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {user.name}
                </td>
                <td>{user.email}</td>
                <td>{user.wins}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          className="btn btn-outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
