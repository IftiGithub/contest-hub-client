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
      <p className="text-center text-red-400">
        Failed to load leaderboard
      </p>
    );

  // Updated: data structure from backend
  const users = data?.data || [];
  const totalCount = data?.totalUsers || 0;
  const totalPages = data?.totalPages || 1;

  if (users.length === 0)
    return (
      <p className="text-center text-gray-400 mt-10">
        No winners yet.
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[var(--bg-primary)] px-4 py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col justify-center items-center">
            <div className="inline-flex items-center gap-3 mb-6 justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[#facc15] to-[#f59e0b] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                Leaderboard
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Top performers and competition winners
            </p>
          </div>
        </motion.div>

        {/* Leaderboard Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">👑</div>
            <div className="stat-label">Total Players</div>
            <div className="stat-value text-2xl">{totalCount}</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">⚡</div>
            <div className="stat-label">Active Competitors</div>
            <div className="stat-value text-2xl">{Math.ceil(totalCount * 0.8)}</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">🎯</div>
            <div className="stat-label">Total Wins</div>
            <div className="stat-value text-2xl">{users.reduce((sum, u) => sum + u.wins, 0)}</div>
          </div>
        </motion.div>

        {/* Leaderboard Table */}
        {users.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              No Winners Yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              Start competing to claim your spot on the leaderboard
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="card-modern overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white">
                    <th className="px-6 py-4 text-left font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left font-semibold">Player</th>
                    <th className="px-6 py-4 text-center font-semibold">Wins</th>
                    <th className="px-6 py-4 text-center font-semibold">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const rank = (page - 1) * ITEMS_PER_PAGE + index + 1;
                    const medalEmoji = rank === 1 ? "👑" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🎖️";

                    return (
                      <motion.tr
                        key={user.email}
                        className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "var(--bg-secondary)" }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{medalEmoji}</span>
                            <span className="font-bold text-lg text-gradient">{rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {user.photoURL && (
                              <motion.img
                                src={user.photoURL}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-[var(--accent-primary)]"
                                whileHover={{ scale: 1.15 }}
                              />
                            )}
                            <div>
                              <div className="font-semibold text-[var(--text-primary)]">
                                {user.name}
                              </div>
                              <div className="text-xs text-[var(--text-muted)]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="badge-gamified">{user.wins} Wins</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {rank === 1 && <span className="text-2xl">👑 Champion</span>}
                          {rank === 2 && <span className="text-2xl">🥈 Runner</span>}
                          {rank === 3 && <span className="text-2xl">🥉 Third</span>}
                          {rank > 3 && rank <= 10 && <span className="text-2xl">⭐ Elite</span>}
                          {rank > 10 && <span className="text-2xl">🌟 Pro</span>}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        <motion.div
          className="flex justify-center items-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${page === 1
                ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-light)]"
                : "btn-gamified hover:scale-105"
              }`}
            whileHover={page !== 1 ? { scale: 1.05 } : {}}
            whileTap={page !== 1 ? { scale: 0.95 } : {}}
          >
            ← Previous
          </motion.button>

          <div className="flex items-center gap-2">
            <span className="text-[var(--text-primary)] font-semibold">
              Page <span className="text-gradient">{page}</span> of <span className="text-gradient">{totalPages}</span>
            </span>
          </div>

          <motion.button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${page === totalPages
                ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-light)]"
                : "btn-gamified hover:scale-105"
              }`}
            whileHover={page !== totalPages ? { scale: 1.05 } : {}}
            whileTap={page !== totalPages ? { scale: 0.95 } : {}}
          >
            Next →
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
