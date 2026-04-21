import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Loading from "./Loading";
import { getApprovedContests } from "../api/contest_api";

const contestTypes = [
    { key: "design", label: "Design" },
    { key: "writing", label: "Article Writing" },
    { key: "business", label: "Business Idea" },
];

const AllContest = () => {
    const [selectedType, setSelectedType] = useState("all");

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ["approvedContests"],
        queryFn: getApprovedContests,
    });

    if (isLoading) return <Loading />;

    // Filter contests by selected type
    const filteredContests =
        selectedType === "all"
            ? contests
            : contests.filter(
                (c) => c.contestType.toLowerCase() === selectedType.toLowerCase()
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
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-xl">🎨</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                            All Contests
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto mb-2">
                        Discover amazing contests and showcase your skills
                    </p>
                </div>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
                className="max-w-7xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    <motion.button
                        onClick={() => setSelectedType("all")}
                        className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                            selectedType === "all"
                                ? "btn-gamified"
                                : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        📋 All
                    </motion.button>
                    {contestTypes.map((type, index) => (
                        <motion.button
                            key={type.key}
                            onClick={() => setSelectedType(type.key)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                                selectedType === type.key
                                    ? "btn-gamified"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            {type.label === "Design" && "🎭"} {type.label === "Article Writing" && "✍️"} {type.label === "Business Idea" && "💼"} {type.label}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Contests Grid */}
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {filteredContests.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                            No Contests Found
                        </h3>
                        <p className="text-[var(--text-secondary)]">
                            Check back later for contests in this category
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContests.map((contest, index) => (
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
                                    {/* Type Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className="badge-gamified">
                                            {contest.contestType}
                                        </span>
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
                                            <span>👥</span>
                                            <span>{contest.participants?.length || 0} Participants</span>
                                        </div>
                                        {contest.prizeMoney && (
                                            <div className="flex items-center gap-2 text-gradient">
                                                <span>💰</span>
                                                <span className="font-semibold">${contest.prizeMoney}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        to={`/contest/${contest._id}`}
                                        className="block"
                                    >
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

export default AllContest;
