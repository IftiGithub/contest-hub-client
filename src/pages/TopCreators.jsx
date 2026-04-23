// src/components/TopCreators.jsx
import { useQuery } from "@tanstack/react-query";
import { secureFetch } from "../api/secureFetch";
import Loading from "./Loading";
import { motion } from "framer-motion";

const TopCreators = () => {
  // Fetch creators
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topCreators"],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/top-creators`),
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-center text-red-400">Failed to load top creators</p>;
  if (!data || data.length === 0) return <p className="text-center text-gray-400">No creators found</p>;

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
              <div className="w-12 h-12 bg-gradient-to-br from-[#ec4899] to-[#a855f7] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🌟</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                Top Creators
              </h1>
            </div>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Meet the most innovative contest creators on the platform
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">👨‍💼</div>
            <div className="stat-label">Total Creators</div>
            <div className="stat-value text-2xl">{data.length}</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">🎪</div>
            <div className="stat-label">Total Contests</div>
            <div className="stat-value text-2xl">{data.reduce((sum, c) => sum + c.count, 0)}</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-gradient">🏅</div>
            <div className="stat-label">Avg Contests</div>
            <div className="stat-value text-2xl">{(data.reduce((sum, c) => sum + c.count, 0) / data.length).toFixed(1)}</div>
          </div>
        </motion.div>

        {/* Creators Table */}
        <motion.div
          className="card-modern overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white">
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Creator</th>
                  <th className="px-6 py-4 text-center font-semibold">Contests Created</th>
                  <th className="px-6 py-4 text-center font-semibold">Badge</th>
                </tr>
              </thead>
              <tbody>
                {data.map((creator, index) => {
                  const medalEmoji = index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎖️";

                  return (
                    <motion.tr
                      key={creator.email}
                      className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{medalEmoji}</span>
                          <span className="font-bold text-lg text-gradient">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {creator.photoURL && (
                            <motion.img
                              src={creator.photoURL}
                              alt={creator.name}
                              className="w-10 h-10 rounded-full border-2 border-[#ec4899]"
                              whileHover={{ scale: 1.15 }}
                            />
                          )}
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">
                              {creator.name}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">
                              {creator.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="badge-gamified">{creator.count} Contests</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {index === 0 && <span className="text-2xl">🎖️ Master Creator</span>}
                        {index === 1 && <span className="text-2xl">⭐ Elite Creator</span>}
                        {index === 2 && <span className="text-2xl">✨ Expert Creator</span>}
                        {index > 2 && index < 10 && <span className="text-2xl">🌟 Pro Creator</span>}
                        {index >= 10 && <span className="text-2xl">👨‍💼 Creator</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[var(--text-secondary)] mb-4">
            Want to become a top creator? Start creating amazing contests today!
          </p>
          <a href="/dashboard/add-contest">
            <motion.button
              className="btn-gamified"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ Create Your Contest
            </motion.button>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopCreators;
