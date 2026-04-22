import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getApprovedContests } from "../../api/contest_api";
import { StatCard } from "./StatCard";
import { StatCardSkeleton } from "./LoadingSkeleton";

// Counter animation hook
const useCountAnimation = (targetValue, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (targetValue === 0) {
            setCount(0);
            return;
        }

        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            const currentCount = Math.floor(easedProgress * targetValue);
            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [targetValue, duration]);

    return count;
};

const LiveStatsSection = () => {
    const { data: allContests = [], isLoading } = useQuery({
        queryKey: ["statsContests"],
        queryFn: getApprovedContests,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5,
    });

    // Calculate stats from real data
    const totalParticipants = allContests.reduce((sum, c) => sum + (c.participants?.length || 0), 0);
    const totalPrizeMoney = allContests.reduce((sum, c) => sum + (c.prizeMoney || 0), 0);
    const activeContests = allContests.length;
    const completedContests = allContests.filter((c) => {
        if (!c.deadline) return false;
        const deadline = new Date(c.deadline);
        return !Number.isNaN(deadline.getTime()) && deadline <= new Date();
    }).length;

    // Animated values
    const animatedActiveContests = useCountAnimation(activeContests);
    const animatedTotalParticipants = useCountAnimation(totalParticipants);
    const animatedTotalPrizeMoney = useCountAnimation(totalPrizeMoney);
    const animatedCompletedContests = useCountAnimation(completedContests);

    const stats = {
        activeContests: animatedActiveContests,
        totalParticipants: animatedTotalParticipants,
        totalPrizeMoney: animatedTotalPrizeMoney,
        completedContests: animatedCompletedContests,
    };

    return (
        <section className="py-20 px-4 bg-[var(--bg-secondary)]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                                Platform Activity
                            </span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Join thousands of creators competing on our platform
                        </p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        <StatCard
                            icon="🎯"
                            label="Active Contests"
                            value={stats.activeContests}
                            isAnimated={true}
                            bgImage="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" // Abstract contest/competition
                        />
                        <StatCard
                            icon="👥"
                            label="Total Participants"
                            value={stats.totalParticipants}
                            isAnimated={true}
                            bgImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop" // Team/people collaborating
                        />
                        <StatCard
                            icon="💰"
                            label="Prize Money Offered"
                            value={stats.totalPrizeMoney}
                            suffix="+"
                            isAnimated={true}
                            bgImage="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop" // Money/wealth concept
                        />
                        <StatCard
                            icon="🏆"
                            label="Contests Completed"
                            value={stats.completedContests}
                            isAnimated={true}
                            bgImage="https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=400&h=300&fit=crop" // Trophy/award
                        />
                    </motion.div>
                )}

                {/* Trust Statement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20 text-center"
                >
                    <p className="text-[var(--text-primary)] font-medium">
                        ✨ Real creators. Real contests. Real opportunities.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default LiveStatsSection;