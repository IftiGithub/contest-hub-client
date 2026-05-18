import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { getContests } from "../../api/contest_api";
import { CreatorCardSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Counter animation hook
const useCountAnimation = (targetValue, duration = 2000, trigger = true) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Only animate when trigger is true
        if (!trigger) {
            setCount(0);
            return;
        }

        if (targetValue === 0 || !targetValue) {
            setCount(0);
            return;
        }

        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easedProgress * targetValue);
            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(targetValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [targetValue, duration, trigger]);

    return count;
};

const TopCreatorsCarousel = () => {
    const [topCreators, setTopCreators] = useState([]);
    const [hasAnimated, setHasAnimated] = useState(false);
    const sectionRef = useRef(null);
    const statsRef = useRef(null);

    // Fetch ALL contests (not just approved)
    const { data: allContests = [], isLoading, error } = useQuery({
        queryKey: ["AllContests"],
        queryFn: getContests,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        const fetchCreatorAvatars = async () => {
            if (allContests.length > 0) {
                // Group contests by creator
                const creatorMap = {};
                const creatorEmails = new Set();

                allContests.forEach(contest => {
                    if (contest.creatorEmail) {
                        creatorEmails.add(contest.creatorEmail);
                        if (!creatorMap[contest.creatorEmail]) {
                            creatorMap[contest.creatorEmail] = {
                                email: contest.creatorEmail,
                                name: contest.creatorName || "Anonymous Creator",
                                contestCount: 0,
                                totalPrize: 0,
                                totalParticipants: 0,
                                completedContests: 0,
                                pendingContests: 0,
                                approvedContests: 0,
                                totalRevenue: 0,
                                joinDate: contest.createdAt || new Date(),
                            };
                        }

                        // Update stats
                        creatorMap[contest.creatorEmail].contestCount += 1;
                        creatorMap[contest.creatorEmail].totalPrize += contest.prizeMoney || 0;
                        creatorMap[contest.creatorEmail].totalParticipants += contest.participants?.length || 0;

                        // Track contest statuses
                        if (contest.status === "completed") {
                            creatorMap[contest.creatorEmail].completedContests += 1;
                        } else if (contest.status === "pending") {
                            creatorMap[contest.creatorEmail].pendingContests += 1;
                        } else if (contest.status === "approved") {
                            creatorMap[contest.creatorEmail].approvedContests += 1;
                        }

                        // Calculate revenue (assuming each participant paid entry fee)
                        const entryFee = contest.price || 0;
                        creatorMap[contest.creatorEmail].totalRevenue += (contest.participants?.length || 0) * entryFee;

                        // Track earliest join date
                        if (contest.createdAt && new Date(contest.createdAt) < new Date(creatorMap[contest.creatorEmail].joinDate)) {
                            creatorMap[contest.creatorEmail].joinDate = contest.createdAt;
                        }
                    }
                });

                // Fetch latest user info (including avatar) from your users endpoint
                try {
                    const userPromises = Array.from(creatorEmails).map(email =>
                        fetch(`https://contest-hub-server.onrender.com/users/${email}`)
                            .then(res => res.json())
                            .catch(() => null)
                    );

                    const usersData = await Promise.all(userPromises);

                    // Create a map of email to user data
                    const userMap = {};
                    usersData.forEach(user => {
                        if (user && user.email) {
                            userMap[user.email] = user;
                        }
                    });

                    // Merge user data (including avatar) with creator stats
                    const sorted = Object.values(creatorMap)
                        .map(creator => ({
                            ...creator,
                            avatar: userMap[creator.email]?.photoURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=8B5CF6&color=fff&bold=true`,
                            name: userMap[creator.email]?.name || creator.name,
                            bio: userMap[creator.email]?.bio || "Creative professional sharing amazing contests",
                            location: userMap[creator.email]?.location || "Global",
                            joinDate: userMap[creator.email]?.createdAt || creator.joinDate,
                        }))
                        .sort((a, b) => b.contestCount - a.contestCount)
                        .slice(0, 10); // Show top 10 creators

                    setTopCreators(sorted);
                } catch (error) {
                    console.error("Error fetching user avatars:", error);
                    // Fallback: use default avatars with initials
                    const sorted = Object.values(creatorMap)
                        .map(creator => ({
                            ...creator,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=8B5CF6&color=fff&bold=true`,
                            bio: "Creative professional sharing amazing contests",
                            location: "Global",
                        }))
                        .sort((a, b) => b.contestCount - a.contestCount)
                        .slice(0, 10);
                    setTopCreators(sorted);
                }
            }
        };

        fetchCreatorAvatars();
    }, [allContests]);

    // Intersection Observer to trigger counter animation when stats section is visible
    useEffect(() => {
        // Don't set up observer if still loading or no data
        if (isLoading || topCreators.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Start animation when stats section becomes visible
                    if (entry.isIntersecting && !hasAnimated) {
                        console.log("Stats section visible, starting animation");
                        setHasAnimated(true);
                    }
                });
            },
            {
                threshold: 0.3, // Trigger when 30% of the stats section is visible
                rootMargin: "0px 0px -100px 0px" // Slightly adjust trigger point
            }
        );

        // Observe the stats section
        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, [isLoading, topCreators.length, hasAnimated]);

    // Calculate summary stats
    const totalCreators = topCreators.length;
    const totalContests = topCreators.reduce((sum, c) => sum + c.contestCount, 0);
    const totalPrizePool = topCreators.reduce((sum, c) => sum + c.totalPrize, 0);
    const totalParticipants = topCreators.reduce((sum, c) => sum + c.totalParticipants, 0);

    // Animated values - only animate when hasAnimated is true
    const animatedTotalCreators = useCountAnimation(totalCreators, 1500, hasAnimated);
    const animatedTotalContests = useCountAnimation(totalContests, 1500, hasAnimated);
    const animatedTotalPrizePool = useCountAnimation(totalPrizePool, 1500, hasAnimated);
    const animatedTotalParticipants = useCountAnimation(totalParticipants, 1500, hasAnimated);

    // Calculate rank badge and color
    const getRankInfo = (index) => {
        switch (index) {
            case 0:
                return { badge: "👑", color: "from-yellow-500 to-orange-500", text: "Top Creator" };
            case 1:
                return { badge: "🥈", color: "from-gray-400 to-gray-500", text: "Rising Star" };
            case 2:
                return { badge: "🥉", color: "from-amber-600 to-amber-700", text: "Featured Creator" };
            default:
                return { badge: "⭐", color: "from-purple-500 to-pink-500", text: "Top Creator" };
        }
    };

    if (error) {
        return (
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-red-500 mb-4">⚠️ Failed to load creators</div>
                    <button onClick={() => window.location.reload()} className="btn-gamified">
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} className="py-20 px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-2">
                            <span className="text-5xl">🌟</span>
                            <h2 className="text-4xl md:text-5xl font-bold">
                                <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                    Top Creators
                                </span>
                            </h2>
                        </div>
                        <p className="text-[var(--text-secondary)]">
                            Meet the most active and successful creators on our platform
                        </p>
                    </div>
                    <Link
                        to="/top-creators"
                        className="btn btn-gamified mt-6 md:mt-0 inline-flex items-center gap-2"
                    >
                        View All Creators <span>→</span>
                    </Link>
                </div>

                {/* Carousel */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <CreatorCardSkeleton key={i} />
                        ))}
                    </div>
                ) : topCreators.length === 0 ? (
                    <EmptyState
                        icon="👤"
                        title="No Creators Yet"
                        description="Be the first to create contests and showcase your talent!"
                        ctaText="Create a Contest"
                        ctaLink="/dashboard"
                    />
                ) : (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation={true}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        loop={true}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 20 },
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 2, spaceBetween: 24 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        className="topCreatorsSwiper"
                    >
                        {topCreators.map((creator, index) => {
                            const rankInfo = getRankInfo(index);
                            const successRate = creator.contestCount > 0
                                ? Math.round((creator.completedContests / creator.contestCount) * 100)
                                : 0;

                            return (
                                <SwiperSlide key={creator.email}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                        className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl border border-[var(--border-light)] hover:border-[var(--accent-primary)]/40 transition-all duration-300"
                                    >
                                        {/* Background Banner with Gradient */}
                                        <div className={`h-32 bg-gradient-to-r ${rankInfo.color} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}>
                                            {/* Rank Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className={`bg-gradient-to-r ${rankInfo.color} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                                                    <span>{rankInfo.badge}</span>
                                                    <span>#{index + 1}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-6 pb-6 text-center relative -mt-12">
                                            {/* Avatar with Border Animation */}
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className="relative inline-block"
                                            >
                                                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${rankInfo.color} blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300`}></div>
                                                <img
                                                    src={creator.avatar}
                                                    alt={creator.name}
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=8B5CF6&color=fff&bold=true`;
                                                    }}
                                                    className="relative w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[var(--bg-primary)] object-cover shadow-lg"
                                                />
                                                {/* Online Indicator */}
                                                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--bg-primary)]"></div>
                                            </motion.div>

                                            {/* Creator Name */}
                                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-primary)] transition">
                                                {creator.name}
                                            </h3>

                                            {/* Role Badge */}
                                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs mb-3">
                                                <span>🏆</span>
                                                <span>{rankInfo.text}</span>
                                            </div>

                                            {/* Bio */}
                                            <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
                                                {creator.bio || "Passionate creator bringing exciting contests to the community"}
                                            </p>

                                            {/* Location & Join Date */}
                                            <div className="flex items-center justify-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                                                {creator.location && (
                                                    <div className="flex items-center gap-1">
                                                        <span>📍</span>
                                                        <span>{creator.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <span>📅</span>
                                                    <span>Joined {new Date(creator.joinDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-[var(--accent-primary)]/10 rounded-lg p-2 transition-all group-hover:bg-[var(--accent-primary)]/20">
                                                    <p className="text-xs text-[var(--text-secondary)]">Contests</p>
                                                    <p className="text-xl font-bold text-[var(--accent-primary)]">
                                                        {creator.contestCount}
                                                    </p>
                                                    <div className="flex justify-center gap-2 text-xs mt-1">
                                                        {creator.approvedContests > 0 && (
                                                            <span className="text-green-400">✓{creator.approvedContests}</span>
                                                        )}
                                                        {creator.pendingContests > 0 && (
                                                            <span className="text-yellow-400">⏳{creator.pendingContests}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-[var(--accent-secondary)]/10 rounded-lg p-2 transition-all group-hover:bg-[var(--accent-secondary)]/20">
                                                    <p className="text-xs text-[var(--text-secondary)]">Prize Money</p>
                                                    <p className="text-xl font-bold text-[var(--accent-secondary)]">
                                                        ${creator.totalPrize.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Additional Stats */}
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <p className="text-xs text-[var(--text-secondary)]">Participants</p>
                                                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                                                        {creator.totalParticipants.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2">
                                                    <p className="text-xs text-[var(--text-secondary)]">Revenue</p>
                                                    <p className="text-lg font-semibold text-green-400">
                                                        ${(creator.totalRevenue || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Success Rate Bar with proper background */}
                                            {creator.contestCount > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                                                        <span>Success Rate</span>
                                                        <span className="font-semibold text-[var(--accent-primary)]">{successRate}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${successRate}%` }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className={`bg-gradient-to-r ${rankInfo.color} h-full rounded-full relative`}
                                                        >
                                                            {/* Shimmer effect on hover */}
                                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                                        </motion.div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                )}

                {/* Stats Summary with Animated Counters - Add ref here */}
                {topCreators.length > 0 && (
                    <motion.div
                        ref={statsRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 pt-8 border-t border-white/10"
                    >
                        <div className="flex flex-col justify-center items-center gap-3">
                            <div className=" text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Summary Stats</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5 p-6 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20 text-center w-full">
                                <div className="group">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {hasAnimated ? animatedTotalCreators : 0}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">Top Creators</div>
                                </div>
                                <div className="group">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        {hasAnimated ? animatedTotalContests : 0}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">Total Contests</div>
                                </div>
                                <div className="group">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        ${hasAnimated ? animatedTotalPrizePool.toLocaleString() : "0"}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">Total Prize Pool</div>
                                </div>
                                <div className="group">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                        {hasAnimated ? animatedTotalParticipants.toLocaleString() : "0"}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">Total Participants</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TopCreatorsCarousel;