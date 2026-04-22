import { motion } from "framer-motion";

export const StatCard = ({ icon, label, value, suffix = "", isAnimated = false, bgImage }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative overflow-hidden rounded-2xl p-6 text-center group"
            style={{
                backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dynamic Overlay - darker for light mode, semi-transparent for dark mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/70 group-hover:from-black/85 group-hover:via-black/70 group-hover:to-black/80 transition-all duration-300"></div>
            
            {/* Gradient accent overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/30 to-[var(--accent-secondary)]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
                <div className="text-5xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                    {icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
                    {isAnimated ? value?.toLocaleString() : value?.toLocaleString()}{suffix}
                </h3>
                <h6 className="text-gray-300 font-medium drop-shadow-sm">
                    {label}
                </h6>
            </div>
        </motion.div>
    );
};