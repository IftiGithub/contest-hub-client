import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useState } from "react";
import { getContests } from "../../api/contest_api";
import { ContestCardSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";

const RecentContestsTab = () => {
    const [activeTab, setActiveTab] = useState("hot"); // "hot" or "recent"

    // Fetch ALL contests (including completed, pending, approved, rejected)
    const { data: allContests = [], isLoading, error } = useQuery({
        queryKey: ["AllContests"],
        queryFn: getContests,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // Sort and filter contests
    const getFilteredContests = () => {
        if (activeTab === "hot") {
            // Hot = Most participants (excluding completed contests)
            return [...allContests]
                .filter(contest => contest.status !== "completed" && contest.status === "approved")
                .sort((a, b) => {
                    const participantsA = Array.isArray(a.participants) ? a.participants.length : 0;
                    const participantsB = Array.isArray(b.participants) ? b.participants.length : 0;
                    return participantsB - participantsA;
                })
                .slice(0, 6);
        } else {
            // Recent = Newest first (include ALL contests)
            return [...allContests]
                .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                    return dateB - dateA;
                })
                .slice(0, 6);
        }
    };

    const filteredContests = getFilteredContests();

    // Debug logging (remove in production)
    if (allContests.length > 0 && filteredContests.length === 0) {
        console.log("No contests found for tab:", activeTab);
        console.log("Total contests:", allContests.length);
        console.log("Contest statuses:", allContests.map(c => c.status));
    }

    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                Discover Contests
                            </span>
                        </h2>
                        <p className="text-[var(--text-secondary)]">Find contests that match your interests</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mt-6 md:mt-0">
                        {[
                            { id: "hot", label: "🔥 Hot & Trending", icon: "hot" },
                            { id: "recent", label: "⏰ Recently Added", icon: "recent" },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "btn-gamified"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]"
                                }`}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">⚠️ Failed to load contests</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn-gamified"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ContestCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredContests.length === 0 ? (
                    <EmptyState
                        icon="📭"
                        title={`No ${activeTab === "hot" ? "Hot" : "Recent"} Contests`}
                        description={activeTab === "hot" 
                            ? "No active trending contests available right now" 
                            : "New contests will appear here soon"}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredContests.map((contest, index) => (
                            <motion.div
                                key={contest._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-[var(--border-light)] hover:border-[var(--accent-primary)]/40 transition-all duration-300"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={contest.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        alt={contest.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                    
                                    {/* Tab-specific Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-[var(--accent-primary)]/80 text-white backdrop-blur">
                                        {activeTab === "hot" ? "🔥 Hot" : "⏰ New"}
                                    </div>
                                    
                                    {/* Status Badge */}
                                    {contest.status === "completed" && (
                                        <div className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-gray-600/80 text-white backdrop-blur">
                                            ✓ Completed
                                        </div>
                                    )}
                                    {contest.status === "pending" && (
                                        <div className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-yellow-500/80 text-white backdrop-blur">
                                            ⏳ Pending
                                        </div>
                                    )}
                                    {contest.status === "approved" && (
                                        <div className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-green-500/80 text-white backdrop-blur">
                                            🔴 Active
                                        </div>
                                    )}
                                    
                                    {/* Participant Count Overlay */}
                                    {contest.participants?.length > 0 && (
                                        <div className="absolute bottom-4 right-4 px-2 py-1 text-xs rounded-full bg-black/60 text-white backdrop-blur">
                                            👥 {contest.participants.length} joined
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 space-y-3">
                                    {/* Title */}
                                    <h3 className="text-lg font-semibold group-hover:text-[var(--accent-primary)] transition line-clamp-2">
                                        {contest.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                        {contest.description?.slice(0, 100)}...
                                    </p>

                                    {/* Creator Info */}
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-1">
                                        <span>👨‍🎨 Created by:</span>
                                        <span className="text-[var(--accent-primary)] font-medium">
                                            {contest.creatorName || "Anonymous"}
                                        </span>
                                    </div>

                                    {/* Creation Date */}
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                        <span>📅 Posted:</span>
                                        <span>
                                            {contest.createdAt 
                                                ? new Date(contest.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                                : 'Recently'
                                            }
                                        </span>
                                    </div>

                                    {/* Deadline (if not completed) */}
                                    {contest.deadline && contest.status !== "completed" && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <span>⏰ Deadline:</span>
                                            <span className={new Date(contest.deadline) < new Date() ? "text-red-400" : "text-[var(--text-muted)]"}>
                                                {new Date(contest.deadline).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                {new Date(contest.deadline) < new Date() && " (Expired)"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Stats Row */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-400">⭐</span>
                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {contest.participants?.length || 0} participants
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-400">💰</span>
                                            <span className="text-purple-400 font-semibold">
                                                ${contest.prizeMoney || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link to={`/contest/${contest._id}`} className="block mt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`btn-gamified w-full ${contest.status === "completed" ? "opacity-50 cursor-not-allowed" : ""}`}
                                            disabled={contest.status === "completed"}
                                        >
                                            {contest.status === "completed" ? "Contest Completed" : "Join Contest →"}
                                        </motion.button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* View All Link */}
                {filteredContests.length > 0 && (
                    <div className="text-center mt-12">
                        <Link to="/all-contest" className="btn btn-gamified inline-flex items-center gap-2">
                            View All Contests <span>→</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentContestsTab;