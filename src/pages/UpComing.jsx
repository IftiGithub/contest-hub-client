// src/pages/Upcoming.jsx
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { secureFetch } from "../api/secureFetch";
import Loading from "./Loading";

const Upcoming = () => {
  // Fetch upcoming contests (status = pending approval)
  const { data: upcomingContests = [], isLoading, isError } = useQuery({
    queryKey: ["upcomingContests"],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/upcoming`),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-400 mt-10">
        Failed to load upcoming contests
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[var(--bg-primary)] px-4 py-16 md:py-20"
    >
      {/* Header Section */}
      <motion.div
        className="max-w-7xl mx-auto mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-[#facc15] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">⏳</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
              Upcoming Contests
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Watch for contests that are coming soon to the platform
          </p>
        </div>
      </motion.div>

      {/* Contests Grid */}
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {upcomingContests.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              No Upcoming Contests Yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              Check back soon for new contests coming to the platform
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingContests.map((contest, index) => (
              <motion.div
                key={contest._id}
                className="card-modern overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-48 bg-[var(--bg-secondary)]">
                  <motion.img
                    src={contest.image}
                    alt={contest.title}
                    className="w-full h-full object-cover group-hover:scale-105"
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Pending Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="badge-warning">⏳ Pending</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">
                    {contest.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                    {contest.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span>👤</span>
                      <span>By {contest.creatorName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span>📅</span>
                      <span>Deadline: {new Date(contest.deadline).toLocaleDateString()}</span>
                    </div>
                    {contest.prizeMoney && (
                      <div className="flex items-center gap-2 text-gradient font-semibold">
                        <span>💰</span>
                        <span>${contest.prizeMoney}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link to={`/contest/${contest._id}`} className="block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button className="btn-gamified w-full">
                        View Details →
                      </button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Upcoming;
