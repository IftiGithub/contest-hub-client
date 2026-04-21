import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import {
    getPopularContests,
    getRecentWinners,
    searchContests,
} from "../api/contest_api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

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
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // ================= SLIDER AUTO PLAY =================
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    // ================= API CALLS =================
    const { data: popularContests = [], isLoading } = useQuery({
        queryKey: ["popularContests"],
        queryFn: getPopularContests,
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

    // ================= SEARCH HANDLER =================
    const handleSearch = async () => {
        if (!searchText.trim()) return;
        setSearchLoading(true);
        try {
            const results = await searchContests(searchText);
            setSearchResults(results);
        } catch (err) {
            console.error(err);
        } finally {
            setSearchLoading(false);
        }
    };

    if (isLoading) return <Loading />;

    // ONLY SHOWING UPDATED RETURN UI (logic stays same)

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

                                {/* Background Image */}
                                <img
                                    src={img}
                                    className="absolute w-full h-full object-cover"
                                    alt="banner"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 bg-black/70"></div>

                                {/* Gradient Glow */}
                                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

                                {/* Content */}
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
                                            <span className="text-white"> Join thousands of creators{" "}</span>
                                            <span
                                                className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
                                                style={{
                                                    textShadow: `0 0 8px rgba(168,85,247,0.8),0 0 16px rgba(168,85,247,0.6),0 0 24px rgba(236,72,153,0.5)`,
                                                }}
                                            >
                                                competing worldwide
                                            </span></p>

                                        {/* CTA */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="flex flex-wrap justify-center gap-4 mt-8"
                                        >
                                            <Link to="/all-contest" className="btn btn-ghost border-none bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-medium shadow-lg hover:scale-105 transition hover:text-white"
                                                style={{
                                                    textShadow: `0 0 8px rgba(168,85,247,0.8),0 0 16px rgba(168,85,247,0.6),0 0 24px rgba(236,72,153,0.5)`,
                                                }}
                                            >
                                                Explore Contests
                                            </Link>

                                            <Link to="/dashboard" className="btn btn-ghost border-none bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-medium shadow-lg hover:scale-105 transition hover:text-white"
                                                style={{
                                                    textShadow: `0 0 8px rgba(168,85,247,0.8),0 0 16px rgba(168,85,247,0.6),0 0 24px rgba(236,72,153,0.5)`,
                                                }}
                                            >
                                                Create Contest
                                            </Link>
                                        </motion.div>

                                        {/* Stats */}
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

                                        {/* Search */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="flex flex-col justify-center items-center lg:flex gap-4 mt-10"
                                        >
                                            <input
                                                value={searchText}
                                                onChange={(e) => setSearchText(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                                placeholder="Search contests..."
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
            {/* ================= POPULAR ================= */}
            <section className="py-24 px-4 relative bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-transparent overflow-hidden">

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* ================= HEADER ================= */}
                    <div className="flex flex-col items-center md:justify-center mb-16">

                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-br from-blue-800 to-blue-400 bg-clip-text text-transparent">
                                Popular Contests
                            </span>
                        </h2>

                    </div>

                    {/* ================= GRID ================= */}
                    <div className="grid md:grid-cols-3 gap-8">

                        {popularContests.map((contest, index) => (
                            <motion.div
                                key={contest._id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative rounded-2xl overflow-hidden 
                    bg-white/5 backdrop-blur-xl border border-white/10 
                    hover:border-purple-400/40 
                    hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]
                    transition-all duration-300"
                            >

                                {/* IMAGE */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={contest.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                    {/* Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-purple-500/80 text-white backdrop-blur">
                                        🔥 Trending
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-6 space-y-3">

                                    <h3 className="text-xl font-semibold group-hover:text-purple-400 transition">
                                        {contest.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {contest.description.slice(0, 100)}...
                                    </p>

                                    {/* STATS */}
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <span className="text-white/70">
                                            {contest.participants?.length || 0} joined
                                        </span>
                                    </div>

                                    {/* BUTTON */}
                                    <Link
                                        to={`/contest/${contest._id}`}
                                        className="btn btn-gamified w-full mt-4"
                                    >
                                        View Contest
                                    </Link>

                                </div>
                            </motion.div>
                        ))}

                    </div>

                    {/* ================= CTA ================= */}
                    <div className="text-center mt-14">
                        <Link
                            to="/all-contest"
                            className="btn btn-gamified text-white font-medium hover:scale-105 transition"
                        >
                            Explore All Contests →
                        </Link>
                    </div>

                </div>
            </section>

            {/* ================= WINNERS ================= */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">

                    <h2 className="text-4xl font-bold text-center mb-12">
                        Top Winners
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {winners.map((winner, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.03 }}
                                className={`rounded-2xl overflow-hidden bg-white/5 border border-white/10 ${index === 0 ? "ring-2 ring-yellow-400 scale-105" : ""
                                    }`}
                            >
                                <img src={winner.winnerImage} className="h-48 w-full object-cover" />

                                <div className="p-6 text-center">
                                    <h3 className="text-xl font-bold">{winner.winnerName}</h3>
                                    <p className="text-gray-400 text-sm">{winner.title}</p>

                                    <p className="text-yellow-400 mt-3 font-semibold">
                                        ${winner.prizeMoney}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="py-20 bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-4">

                    <h2 className="text-4xl font-bold text-center mb-12">
                        Why Choose Us
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
                            >
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-400">{f.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;