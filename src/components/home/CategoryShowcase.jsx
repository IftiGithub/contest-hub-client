import { motion } from "framer-motion";
import { Link } from "react-router";

const CategoryShowcase = () => {
    const categories = [
        {
            id: "design",
            icon: "🎨",
            name: "Design",
            description: "UI/UX, Graphic Design, Branding",
            bgImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", // Design workspace
        },
        {
            id: "writing",
            icon: "✍️",
            name: "Writing",
            description: "Articles, Stories, Content Creation",
            bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop", // Writing desk
        },
        {
            id: "business",
            icon: "💼",
            name: "Business Ideas",
            description: "Startups, Innovation, Entrepreneurship",
            bgImage: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&h=400&fit=crop", // Business meeting
        },
        {
            id: "gaming",
            icon: "🎮",
            name: "Gaming",
            description: "Game Reviews, Let's Plays, Speedruns",
            bgImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop", // Gaming setup
        },
        {
            id: "photography",
            icon: "📷",
            name: "Photography",
            description: "Photo Contests, Portfolio Building",
            bgImage: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=600&h=400&fit=crop", // Camera lens
        },
        {
            id: "music",
            icon: "🎵",
            name: "Music",
            description: "Compositions, Covers, Remixes",
            bgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop", // Music instruments
        },
    ];

    return (
        <section className="py-20 px-4">
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
                                Explore by Category
                            </span>
                        </h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Find contests in your favorite niche and showcase your skills
                        </p>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                        >
                            <Link
                                to={`/all-contest?category=${category.id}`}
                                className="block h-full"
                            >
                                <motion.div
                                    className="relative h-full p-6 rounded-2xl overflow-hidden border border-[var(--border-light)] hover:border-[var(--accent-primary)]/50 transition-all duration-300 cursor-pointer group"
                                    whileHover={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                                >
                                    {/* Background Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${category.bgImage})` }}
                                    />

                                    {/* Dark Overlay */}
                                    {<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 group-hover:bg-black/70 transition-all duration-300" />
                                    }
                                    {/* Content */}
                                    <div className="relative z-10 space-y-3">
                                        <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-white group-hover:text-[var(--accent-primary)] transition">
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-200 mt-2">
                                                {category.description}
                                            </p>
                                        </div>
                                        <div className="pt-4 flex items-center text-[var(--accent-primary)] font-medium group-hover:translate-x-2 transition-transform">
                                            Explore →
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;