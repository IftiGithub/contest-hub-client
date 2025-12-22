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
import WhyJoin from "../components/home/WhyJoin";

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
    });

    const { data: winners = [] } = useQuery({
        queryKey: ["recentWinners"],
        queryFn: getRecentWinners,
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

    return (
        <div className="px-4">

            {/* ======================= BANNER SECTION ======================= */}
            <section className="relative h-[80vh] rounded-2xl overflow-hidden mb-16">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentSlide}
                        src={bannerImages[currentSlide]}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white max-w-2xl px-4"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                            Create. Compete. Win.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8">
                            Join creative contests and turn your skills into rewards
                        </p>

                        {/* SEARCH BAR */}
                        <div className="flex gap-3 justify-center">
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                type="text"
                                placeholder="Search contests by type (design, writing...)"
                                className="input input-lg w-full max-w-xl text-black font-semibold shadow-xl focus:ring-4 focus:ring-primary"
                            />
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary btn-lg"
                            >
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ======================= SEARCH RESULTS ======================= */}
            {searchText && (
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-6">
                        🔍 Search Results
                    </h2>

                    {searchLoading ? (
                        <Loading />
                    ) : searchResults.length === 0 ? (
                        <p className="text-gray-500">No contests found.</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {searchResults.map((contest) => (
                                <div key={contest._id} className="card bg-base-100 shadow">
                                    <img
                                        src={contest.image}
                                        alt={contest.title}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="card-body">
                                        <h3 className="card-title">{contest.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {contest.description.slice(0, 80)}...
                                        </p>
                                        <Link
                                            to={`/contest/${contest._id}`}
                                            className="btn btn-sm btn-primary mt-2"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* ======================= POPULAR CONTESTS ======================= */}
            <section className="my-20">
                <h2 className="text-3xl font-bold mb-8">🔥 Popular Contests</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {popularContests.map((contest) => (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            key={contest._id}
                            className="card bg-base-100 shadow-lg"
                        >
                            <img
                                src={contest.image}
                                alt={contest.title}
                                className="h-48 w-full object-cover"
                            />
                            <div className="card-body">
                                <h3 className="card-title">{contest.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {contest.description.slice(0, 80)}...
                                </p>
                                <p className="text-sm">
                                    👥 {contest.participants.length} Participants
                                </p>
                                <Link
                                    to={`/contest/${contest._id}`}
                                    className="btn btn-primary btn-sm mt-2"
                                >
                                    Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link to="/all-contests" className="btn btn-outline btn-wide">
                        Show All Contests
                    </Link>
                </div>
            </section>

            {/* ======================= WINNER ADVERTISEMENT ======================= */}
            <section className="my-28 relative overflow-hidden rounded-3xl">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-95"></div>

                {/* Decorative Blur Shapes */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 p-12 md:p-16">
                    {/* Heading */}
                    <div className="text-center text-white mb-14">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            🏆 Our Recent Winners
                        </h2>
                        <p className="text-lg md:text-xl text-white/90">
                            Who knows? The next picture might be yours, <span className="font-semibold">Champion</span>!
                        </p>
                        <p className="text-sm md:text-base mt-2 text-white/80">
                            Register to a contest today and make your mark 🚀
                        </p>
                    </div>

                    {/* Winners Grid */}
                    {winners.length === 0 ? (
                        <p className="text-center text-white/80 text-lg">
                            Winners will be announced soon. Stay tuned ✨
                        </p>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-3">
                            {winners.map((winner, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.07, y: -8 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    {/* Winner Image */}
                                    <img
                                        src={winner.winnerImage}
                                        alt={winner.winnerName}
                                        className="h-44 w-full object-cover"
                                    />

                                    {/* Winner Info */}
                                    <div className="p-6 text-center text-white">
                                        <h3 className="text-xl font-bold mb-1">
                                            {winner.winnerName}
                                        </h3>

                                        <p className="text-sm text-white/80 mb-2">
                                            {winner.title}
                                        </p>

                                        <p className="text-lg font-extrabold text-yellow-300">
                                            💰 Won ${winner.prizeMoney}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* ======================= EXTRA SECTION ======================= */}
            <WhyJoin></WhyJoin>
        </div>
    );
};

export default Home;
