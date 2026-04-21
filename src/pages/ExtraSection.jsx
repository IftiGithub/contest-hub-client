import { motion } from "framer-motion";
import { Link } from "react-router";

const features = [
  {
    title: "Global Exposure",
    description:
      "Showcase your skills to a worldwide audience and get recognized by top professionals.",
    icon: "🌍",
  },
  {
    title: "Exciting Rewards",
    description:
      "Win amazing prizes and gain opportunities that can boost your career.",
    icon: "🏆",
  },
  {
    title: "Community Support",
    description:
      "Connect with like-minded creators, collaborate, and learn from each other.",
    icon: "🤝",
  },
];

const ExtraSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white px-4"
    >
      {/* ===== Hero Section ===== */}
      <section className="relative h-[60vh] rounded-xl overflow-hidden mb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              🚀 Extra Features
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Explore additional perks of ContestHub and make your journey creative and rewarding.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/all-contest"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black transition"
              >
                View Contests
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== Feature Cards ===== */}
      <section className="my-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Why ContestHub?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="card-gamified p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                className="text-6xl mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Call to Action ===== */}
      <section className="my-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-16 text-center text-white">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Ready to Showcase Your Talent?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl mb-8 text-gray-200"
        >
          Join contests, win prizes, and become a part of our thriving creative community.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/all-contest"
            className="btn-gamified text-lg px-8 py-3"
          >
            Explore Contests
          </Link>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default ExtraSection;
