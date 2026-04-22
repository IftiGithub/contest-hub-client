import { motion } from "framer-motion";
import { Link } from "react-router";

export const EmptyState = ({ icon = "🔍", title = "No Contests Found", description = "Check back later for new contests", ctaText = "Explore Contests", ctaLink = "/all-contest" }) => (
    <motion.div
        className="text-center py-20"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
    >
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            {title}
        </h3>
        <p className="text-[var(--text-secondary)] mb-6">
            {description}
        </p>
        <Link to={ctaLink} className="btn btn-gamified">
            {ctaText}
        </Link>
    </motion.div>
);
