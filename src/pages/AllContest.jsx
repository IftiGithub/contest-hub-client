import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Loading from "./Loading";
import { getContests } from "../api/contest_api";

const predefinedContestTypes = [
    { key: "design", label: "Design", icon: "🎭" },
    { key: "writing", label: "Writing", icon: "✍️" },
    { key: "idea", label: "Idea", icon: "💡" },
    { key: "gaming", label: "Gaming", icon: "🎮" },
    { key: "music", label: "Music", icon: "🎵" },
    { key: "photography", label: "Photography", icon: "📸" },
];

// Helper function for status badges
const getStatusBadge = (status) => {
    switch(status) {
        case "completed":
            return { color: "bg-gray-600", text: "✓ Completed", icon: "🏆" };
        case "approved":
            return { color: "bg-green-500", text: "🔴 Active", icon: "⚡" };
        case "pending":
            return { color: "bg-yellow-500", text: "⏳ Pending", icon: "⏰" };
        case "rejected":
            return { color: "bg-red-500", text: "❌ Rejected", icon: "🚫" };
        default:
            return { color: "bg-blue-500", text: status, icon: "📌" };
    }
};

const AllContest = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // 3 rows of 3 columns

    const searchQuery = searchParams.get("search") || "";
    const categoryQuery = searchParams.get("category") || "";
    const pageParam = searchParams.get("page");

    // Sync current page with URL param
    useEffect(() => {
        if (pageParam) {
            setCurrentPage(parseInt(pageParam));
        } else {
            setCurrentPage(1);
        }
    }, [pageParam]);

    // Fetch ALL contests
    const { data: contests = [], isLoading, error } = useQuery({
        queryKey: ["AllContests"],
        queryFn: getContests,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // Get all custom contest types from the contests
    const predefinedKeys = predefinedContestTypes.map(type => type.key.toLowerCase());
    const customContestTypes = [...new Set(
        contests
            .map(c => c.contestType?.toLowerCase())
            .filter(type => type && !predefinedKeys.includes(type))
    )];

    // Create contest types array with predefined + others category
    const contestTypes = [
        ...predefinedContestTypes,
        ...(customContestTypes.length > 0 ? [{ key: "others", label: "Others", icon: "🎲", customTypes: customContestTypes }] : [])
    ];

    // Check if search query matches a contest type
    const searchQueryLower = searchQuery.toLowerCase();
    const matchedTypeKey = predefinedContestTypes.find(t =>
        t.key.toLowerCase() === searchQueryLower ||
        t.label.toLowerCase() === searchQueryLower
    )?.key;

    // Set initial selected type from URL
    useEffect(() => {
        if (categoryQuery && selectedType === "all") {
            setSelectedType(categoryQuery);
            setCurrentPage(1); // Reset page when filter changes
        } else if (matchedTypeKey && selectedType === "all") {
            setSelectedType(matchedTypeKey);
            setCurrentPage(1);
        }
    }, [categoryQuery, matchedTypeKey]);

    // Determine active filter
    const activeTypeFilter = selectedType;

    // Filter contests by active type filter
    const filteredContests = contests.filter((c) => {
        const contestType = c.contestType?.toLowerCase() || "";

        let matchesType = false;
        if (activeTypeFilter === "all") {
            matchesType = true;
        } else if (activeTypeFilter === "others") {
            matchesType = !predefinedKeys.includes(contestType);
        } else {
            matchesType = contestType === activeTypeFilter.toLowerCase();
        }

        return matchesType;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredContests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContests = filteredContests.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Update URL with page number
        if (page === 1) {
            searchParams.delete("page");
        } else {
            searchParams.set("page", page);
        }
        setSearchParams(searchParams);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handle category change
    const handleCategoryChange = (typeKey) => {
        setSelectedType(typeKey);
        setCurrentPage(1); // Reset to first page
        
        if (typeKey === "all") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", typeKey);
        }
        searchParams.delete("page");
        if (searchParams.has("search")) {
            searchParams.delete("search");
        }
        setSearchParams(searchParams);
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedType("all");
        setCurrentPage(1);
        searchParams.delete("category");
        searchParams.delete("search");
        searchParams.delete("page");
        setSearchParams(searchParams);
    };

    if (isLoading) return <Loading />;

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
                <div className="flex flex-col items-center justify-center">
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

            {/* Error State */}
            {error && (
                <div className="max-w-7xl mx-auto mb-8">
                    <div className="text-center py-8 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <div className="text-red-500 mb-4">⚠️ Failed to load contests</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="btn-gamified"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filter Indicator */}
            {(categoryQuery || searchQuery) && (
                <div className="max-w-7xl mx-auto mb-6">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {categoryQuery && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-secondary)]">
                                <span>🏷️</span>
                                <span>Category: <strong className="text-[var(--text-primary)]">{categoryQuery}</strong></span>
                            </div>
                        )}
                        {searchQuery && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-2 text-sm text-[var(--text-secondary)]">
                                <span>🔍</span>
                                <span>Search: <strong className="text-[var(--text-primary)]">{searchQuery}</strong></span>
                            </div>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Tabs */}
            <motion.div
                className="max-w-7xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex flex-wrap justify-center gap-3">
                    <motion.button
                        onClick={() => handleCategoryChange("all")}
                        className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                            activeTypeFilter === "all"
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
                            onClick={() => handleCategoryChange(type.key)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                                activeTypeFilter === type.key
                                    ? "btn-gamified"
                                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            {type.icon} {type.label}
                            {type.key === "others" && customContestTypes.length > 0 && (
                                <span className="ml-1 text-xs">({customContestTypes.length})</span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Results Count */}
            <div className="max-w-7xl mx-auto mb-6">
                <p className="text-[var(--text-secondary)] text-center">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredContests.length)} of {filteredContests.length} contest{filteredContests.length !== 1 ? "s" : ""}
                    {activeTypeFilter !== "all" && (
                        <span className="text-[var(--accent-primary)] ml-2">
                            in {activeTypeFilter === "others" ? "Other Categories" : activeTypeFilter} category
                        </span>
                    )}
                </p>
            </div>

            {/* Contests Grid */}
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {paginatedContests.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
                            No Contests Found
                        </h3>
                        <p className="text-[var(--text-secondary)] mb-6">
                            {activeTypeFilter === "others" 
                                ? "No custom contest types available at the moment" 
                                : `No contests found in the ${activeTypeFilter} category`}
                        </p>
                        {activeTypeFilter !== "all" && (
                            <button
                                onClick={() => handleCategoryChange("all")}
                                className="btn-gamified"
                            >
                                View All Contests
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedContests.map((contest, index) => {
                                const statusInfo = getStatusBadge(contest.status);
                                return (
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            
                                            {/* Type Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className="badge-gamified">
                                                    {contest.contestType}
                                                </span>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            <div className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-full ${statusInfo.color} text-white backdrop-blur`}>
                                                {statusInfo.icon} {statusInfo.text}
                                            </div>
                                            
                                            {/* Participant Count Overlay */}
                                            {contest.participants?.length > 0 && (
                                                <div className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded-full bg-black/60 text-white backdrop-blur">
                                                    👥 {contest.participants.length} joined
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 space-y-3">
                                            {/* Title */}
                                            <h3 className="text-lg font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent-primary)] transition">
                                                {contest.title}
                                            </h3>
                                            
                                            {/* Description */}
                                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                                {contest.description?.slice(0, 100)}...
                                            </p>

                                            {/* Creator Info */}
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-1">
                                                <span>👨‍🎨</span>
                                                <span>{contest.creatorName || "Anonymous"}</span>
                                            </div>

                                            {/* Creation Date */}
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                                <span>📅</span>
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

                                            {/* Deadline */}
                                            {contest.deadline && contest.status !== "completed" && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span>⏰</span>
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
                                                    {contest.status === "completed" ? "Contest Completed" : "View Details →"}
                                                </motion.button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination Component */}
                        {totalPages > 1 && (
                            <motion.div 
                                className="flex justify-center items-center gap-2 mt-12 flex-wrap"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {/* Previous Button */}
                                <motion.button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        currentPage === 1
                                            ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed opacity-50"
                                            : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                                    }`}
                                >
                                    ← Previous
                                </motion.button>

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {(() => {
                                        const pageNumbers = [];
                                        const maxVisible = 5;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                                        
                                        if (endPage - startPage + 1 < maxVisible) {
                                            startPage = Math.max(1, endPage - maxVisible + 1);
                                        }
                                        
                                        for (let i = startPage; i <= endPage; i++) {
                                            pageNumbers.push(i);
                                        }
                                        
                                        return pageNumbers.map((page) => (
                                            <motion.button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                                                    currentPage === page
                                                        ? "btn-gamified"
                                                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]"
                                                }`}
                                            >
                                                {page}
                                            </motion.button>
                                        ));
                                    })()}
                                </div>

                                {/* Next Button */}
                                <motion.button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        currentPage === totalPages
                                            ? "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed opacity-50"
                                            : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-light)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                                    }`}
                                >
                                    Next →
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Page Info */}
                        {totalPages > 1 && (
                            <div className="text-center mt-4 text-sm text-[var(--text-muted)]">
                                Page {currentPage} of {totalPages}
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AllContest;