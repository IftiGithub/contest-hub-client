import { motion } from "framer-motion";

// Skeleton for contest cards
export const ContestCardSkeleton = () => (
    <motion.div
        className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-light)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    >
        <div className="h-48 bg-gradient-to-r from-[var(--bg-accent)] to-[var(--bg-secondary)]" />
        <div className="p-6 space-y-3">
            <div className="h-6 bg-[var(--bg-accent)] rounded w-3/4" />
            <div className="h-4 bg-[var(--bg-accent)] rounded w-full" />
            <div className="h-4 bg-[var(--bg-accent)] rounded w-5/6" />
            <div className="h-10 bg-[var(--bg-accent)] rounded w-full mt-4" />
        </div>
    </motion.div>
);

// Skeleton for winner cards
export const WinnerCardSkeleton = () => (
    <motion.div
        className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-light)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    >
        <div className="h-48 bg-gradient-to-r from-[var(--bg-accent)] to-[var(--bg-secondary)]" />
        <div className="p-6 text-center space-y-3">
            <div className="h-6 bg-[var(--bg-accent)] rounded w-3/4 mx-auto" />
            <div className="h-4 bg-[var(--bg-accent)] rounded w-1/2 mx-auto" />
            <div className="h-6 bg-[var(--bg-accent)] rounded w-2/4 mx-auto mt-3" />
        </div>
    </motion.div>
);

// Skeleton for creator cards
export const CreatorCardSkeleton = () => (
    <motion.div
        className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-light)] p-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    >
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-accent)]" />
            <div className="flex-1 space-y-2">
                <div className="h-5 bg-[var(--bg-accent)] rounded w-3/4" />
                <div className="h-4 bg-[var(--bg-accent)] rounded w-1/2" />
                <div className="h-4 bg-[var(--bg-accent)] rounded w-2/3" />
            </div>
        </div>
    </motion.div>
);

// Skeleton for stat cards
export const StatCardSkeleton = () => (
    <motion.div
        className="rounded-2xl p-6 bg-[var(--bg-secondary)] border border-[var(--border-light)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    >
        <div className="space-y-3">
            <div className="h-4 bg-[var(--bg-accent)] rounded w-2/3" />
            <div className="h-8 bg-[var(--bg-accent)] rounded w-1/2" />
        </div>
    </motion.div>
);
