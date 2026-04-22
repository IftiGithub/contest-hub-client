import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import {
    getRecentWinners,
    getContests
} from "../api/contest_api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import RecentContestsTab from "../components/home/RecentContestsTab";
import CategoryShowcase from "../components/home/CategoryShowcase";
import TopCreatorsCarousel from "../components/home/TopCreatorsCarousel";
import LiveStatsSection from "../components/home/LiveStatsSection";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Typewriter } from "react-simple-typewriter";
import Marquee from "react-fast-marquee";

const features = [
    {
        title: "Global Exposure",
        description:
            "Showcase your skills to a worldwide audience and get recognized by top professionals.",
        icon: "🌍",
        color: "from-blue-500 to-purple-600",
    },
    {
        title: "Exciting Rewards",
        description:
            "Win amazing prizes and gain opportunities that can boost your career.",
        icon: "🏆",
        color: "from-yellow-400 to-orange-500",
    },
    {
        title: "Community Support",
        description:
            "Connect with like-minded creators, collaborate, and learn from each other.",
        icon: "🤝",
        color: "from-green-400 to-teal-500",
    },
];

const bannerImages = [
    "https://i.postimg.cc/9QXSMSg8/jess-bailey-q10VITr-VYUM-unsplash.jpg",
    "https://i.postimg.cc/vTH99WJK/2h-media-Nm-SPbe0b-Dtc-unsplash.jpg",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
];

const Home = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);

    // ================= SLIDER AUTO PLAY =================
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    // ================= API CALLS =================
    // Fetch ALL contests (including pending, approved, completed, rejected)
    const { data: allContests = [], isLoading, error } = useQuery({
        queryKey: ["AllContests"],
        queryFn: getContests,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    const { data: winners = [] } = useQuery({
        queryKey: ["recentWinners"],
        queryFn: getRecentWinners,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // Debug logging (remove in production)
    useEffect(() => {
        if (allContests.length > 0) {
            console.log("📊 Total contests fetched:", allContests.length);
            const statusBreakdown = {};
            allContests.forEach(c => {
                statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;
            });
            console.log("Status breakdown:", statusBreakdown);
        }
        if (error) {
            console.error("Error fetching contests:", error);
        }
    }, [allContests, error]);

    // 1. Hot & Trending: Don't show completed contests, sort by participants count (highest first) - show top 5
    const hotAndTrending = [...allContests]
        .filter(contest => contest.status !== "completed" && contest.status === "approved")
        .sort((a, b) => {
            const participantsA = Array.isArray(a.participants) ? a.participants.length : 0;
            const participantsB = Array.isArray(b.participants) ? b.participants.length : 0;
            return participantsB - participantsA;
        })
        .slice(0, 5);

    // 2. Recently Added: Show ALL contests, sort by createdAt (newest first) - show top 5
    const recentlyAdded = [...allContests]
        .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        })
        .slice(0, 5);

    // 3. Popular Contests: Show ALL contests, sort by participants count (highest first) - show top 5
    const popularContests = [...allContests]
        .sort((a, b) => {
            const participantsA = Array.isArray(a.participants) ? a.participants.length : 0;
            const participantsB = Array.isArray(b.participants) ? b.participants.length : 0;
            return participantsB - participantsA;
        })
        .slice(0, 5);

    // ================= SEARCH HANDLER =================
    const handleSearch = () => {
        if (!searchText.trim()) return;
        navigate(`/all-contest?search=${encodeURIComponent(searchText)}`);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">

            {/* ================= HERO ================= */}
            <section className="relative h-[90vh] overflow-hidden">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    loop={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    className="h-full"
                >
                    {bannerImages.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-[90vh] w-full">
                                <img
                                    src={img}
                                    className="absolute w-full h-full object-cover"
                                    alt="banner"
                                />
                                <div className="absolute inset-0 bg-black/70"></div>
                                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

                                <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
                                    <div className="max-w-4xl">
                                        <motion.h1
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="text-5xl md:text-7xl font-bold leading-tight"
                                        >
                                            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                                Compete Globally
                                            </span>
                                            <br />
                                            <span className="text-white">
                                                <Typewriter
                                                    words={[
                                                        "Win Creatively",
                                                        "Earn Rewards",
                                                        "Show Your Talent",
                                                        "Compete Worldwide",
                                                    ]}
                                                    loop={true}
                                                    cursor
                                                    cursorStyle="|"
                                                    typeSpeed={70}
                                                    deleteSpeed={40}
                                                    delaySpeed={1500}
                                                />
                                            </span>
                                        </motion.h1>
                                        <p>
                                            <span className="text-white"> Join thousands of creators </span>
                                            <span
                                                className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
                                                style={{
                                                    textShadow: `0 0 12px var(--accent-primary), 0 0 20px var(--accent-secondary)`,
                                                }}
                                            >
                                                competing worldwide
                                            </span>
                                        </p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex flex-wrap justify-center gap-4 mt-8"
                                        >
                                            <Link
                                                to="/all-contest"
                                                className="btn btn-ghost border-none bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-medium shadow-lg hover:scale-105 transition hover:text-white"
                                                style={{
                                                    textShadow: `0 0 12px var(--accent-primary), 0 0 20px var(--accent-secondary)`,
                                                }}
                                            >
                                                Explore Contests
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                className="btn btn-ghost border-none bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-medium shadow-lg hover:scale-105 transition hover:text-white"
                                                style={{
                                                    textShadow: `0 0 12px var(--accent-primary), 0 0 20px var(--accent-secondary)`,
                                                }}
                                            >
                                                Create Contest
                                            </Link>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.6 }}
                                            className="flex justify-center gap-6 mt-8 text-white/70 text-sm flex-wrap"
                                        >
                                            <span>🔥 10K+ Users</span>
                                            <span>🏆 500+ Winners</span>
                                            <span>💰 $50K+ Paid</span>
                                        </motion.div>

                                        <Marquee speed={40} gradient={true} gradientColor={[0, 0, 0]} className="mt-10">
                                            {[
                                                "🔥 UI Design – $500",
                                                "🏆 Logo Contest – $300",
                                                "🎮 Game Review – $200",
                                                "✍️ Writing – $150",
                                                "🚀 Startup Idea – $1000",
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="mx-4 px-6 py-3 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl text-white text-sm hover:bg-white/20 transition"
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </Marquee>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="flex flex-col justify-center items-center lg:flex-row gap-4 mt-10"
                                        >
                                            <input
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                                placeholder="Writing, Business, Design..."
                                                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md w-80"
                                            />
                                            <button
                                                onClick={handleSearch}
                                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-medium hover:scale-105 transition"
                                            >
                                                Search
                                            </button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            <RecentContestsTab></RecentContestsTab>
            <CategoryShowcase />
            <LiveStatsSection />
            {/* ================= POPULAR CONTESTS SECTION ================= */}
            {popularContests.length > 0 && (
                <section className="py-24 px-4 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col items-center md:justify-center mb-16">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">⭐</span>
                                <h2 className="text-4xl md:text-5xl font-bold">
                                    <span className="bg-gradient-to-br from-[#ec4899] to-[#a855f7] bg-clip-text text-transparent">
                                        Popular Contests
                                    </span>
                                </h2>
                            </div>
                            <p className="text-gray-400 mt-2">Most participated contests of all time</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {popularContests.map((contest, index) => (
                                <motion.div
                                    key={contest._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={contest.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                            alt={contest.title}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                        {/* Popular Badge */}
                                        <div className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-purple-500/80 text-white backdrop-blur">
                                            ⭐ #{index + 1} Popular
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

                                        {/* Participant Count Badge */}
                                        {contest.participants?.length > 0 && (
                                            <div className="absolute bottom-4 right-4 px-2 py-1 text-xs rounded-full bg-black/60 text-white backdrop-blur">
                                                👥 {contest.participants.length} participants
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 space-y-3">
                                        {/* Title */}
                                        <h3 className="text-xl font-semibold group-hover:text-purple-400 transition line-clamp-1">
                                            {contest.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {contest.description?.slice(0, 100)}...
                                        </p>

                                        {/* Creator Info */}
                                        <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                            <span>👨‍🎨 Created by:</span>
                                            <span className="text-purple-400 font-medium">
                                                {contest.creatorName || "Anonymous"}
                                            </span>
                                        </div>

                                        {/* Creation Date */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
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

                                        {/* Deadline */}
                                        {contest.deadline && contest.status !== "completed" && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>⏰ Deadline:</span>
                                                <span className={new Date(contest.deadline) < new Date() ? "text-red-400" : "text-gray-400"}>
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
                                        <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-400">⭐</span>
                                                <span className="text-sm text-gray-300">
                                                    {contest.participants?.length || 0} joined
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
                                                {contest.status === "completed" ? "Contest Completed" : "View Contest →"}
                                            </motion.button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Link */}
                        <div className="text-center mt-14">
                            <Link
                                to="/all-contest"
                                className="btn btn-gamified text-white font-medium hover:scale-105 transition inline-flex items-center gap-2"
                            >
                                Explore All Contests <span>→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <TopCreatorsCarousel />
            {/* ================= WINNERS SECTION ================= */}
            <section className="py-20 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-5xl">🏆</span>
                            <h2 className="text-4xl md:text-5xl font-bold">
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                    Top Winners
                                </span>
                            </h2>
                        </div>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Celebrating our most successful contestants and their amazing achievements
                        </p>
                    </div>

                    {/* Winners Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {winners.map((winner, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`group relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border transition-all duration-300 ${index === 0
                                    ? "border-yellow-400/50 shadow-[0_0_30px_rgba(234,179,8,0.3)] ring-2 ring-yellow-400/50"
                                    : "border-white/10 hover:border-yellow-400/30"
                                    }`}
                            >
                                {/* Winner Badge for Top 3 */}
                                {index === 0 && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                            <span>👑</span>
                                            <span>#1 Winner</span>
                                        </div>
                                    </div>
                                )}
                                {index === 1 && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                            <span>🥈</span>
                                            <span>#2 Runner Up</span>
                                        </div>
                                    </div>
                                )}
                                {index === 2 && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                                            <span>🥉</span>
                                            <span>#3 Runner Up</span>
                                        </div>
                                    </div>
                                )}

                                {/* Winner Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <motion.img
                                        src={winner.winnerImage}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        alt={winner.winnerName}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                                    {/* Prize Badge */}
                                    <div className="absolute bottom-4 right-4 z-10">
                                        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                                            <span className="text-yellow-400">💰</span>
                                            <span className="text-white font-semibold">${winner.prizeMoney}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Winner Info */}
                                <div className="p-6 text-center space-y-3">
                                    {/* Winner Name */}
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        {winner.winnerName}
                                    </h3>

                                    {/* Contest Title */}
                                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)]">
                                        <span>🏆</span>
                                        <p>{winner.title}</p>
                                    </div>

                                    {/* Contest Type Badge */}
                                    {winner.contestType && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                                            <span>🎯</span>
                                            <span>{winner.contestType}</span>
                                        </div>
                                    )}

                                    {/* Winning Stats */}
                                    <div className="pt-3 space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-sm">
                                            <span className="text-yellow-400">⭐</span>
                                            <span className="text-[var(--text-secondary)]">Grand Prize Winner</span>
                                        </div>
                                        {winner.winningDate && (
                                            <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
                                                <span>📅</span>
                                                <span>Won on {new Date(winner.winningDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Line */}
                                    <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mt-4"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* View More Link (if there are more winners) */}
                    {winners.length >= 6 && (
                        <div className="text-center mt-12">
                            <Link to="/leaderboard" className="btn btn-gamified inline-flex items-center gap-2">
                                View Full Leaderboard <span>→</span>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
            {/* ================= FEATURES SECTION ================= */}
            <section className="py-20 bg-[var(--bg-secondary)] relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    {/* Header */}
                    <div className="flex flex-col justify-center items-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-5xl">✨</span>
                            <h2 className="text-4xl md:text-5xl font-bold">
                                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                    Why Choose Us
                                </span>
                            </h2>
                        </div>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Join thousands of creators who have found success on our platform
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 hover:border-[var(--accent-primary)]/40 transition-all duration-300"
                            >
                                {/* Animated Background Gradient */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                {/* Icon Container */}
                                <div className={`relative mb-6 inline-block`}>
                                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
                                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-3xl">{feature.icon}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                                    {feature.description}
                                </p>

                                {/* Learn More Link */}
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="inline-flex items-center gap-2 text-sm text-[var(--accent-primary)] font-medium cursor-pointer"
                                >
                                    <span>Learn More</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </motion.div>

                                {/* Decorative Element */}
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                                    <div className="w-16 h-16 bg-white rounded-full blur-xl"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats Counter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-20 pt-8 border-t border-white/10"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[var(--accent-primary)]">10K+</div>
                                <div className="text-sm text-[var(--text-muted)] mt-2">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[var(--accent-primary)]">500+</div>
                                <div className="text-sm text-[var(--text-muted)] mt-2">Contests Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[var(--accent-primary)]">$50K+</div>
                                <div className="text-sm text-[var(--text-muted)] mt-2">Prize Money Paid</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[var(--accent-primary)]">98%</div>
                                <div className="text-sm text-[var(--text-muted)] mt-2">Satisfaction Rate</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-16 text-center"
                    >
                        <div className="inline-flex flex-col sm:flex-row gap-4">
                            <Link to="/all-contest">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-gamified px-8 py-3"
                                >
                                    Start Your Journey →
                                </motion.button>
                            </Link>
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 rounded-xl bg-transparent border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold hover:bg-[var(--accent-primary)]/10 transition-all duration-300"
                                >
                                    Become a Creator
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;