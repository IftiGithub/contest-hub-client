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
    <div className="px-4">

      {/* ===== Hero Section ===== */}
      <section className="relative h-[60vh] rounded-xl overflow-hidden mb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              🚀 Extra Features
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Explore additional perks of ContestHub and make your journey creative and rewarding.
            </p>
            <Link
              to="/all-contest"
              className="btn btn-outline btn-lg text-white hover:text-black hover:bg-white transition"
            >
              View Contests
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== Feature Cards ===== */}
      <section className="my-20 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Why ContestHub?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Call to Action ===== */}
      <section className="my-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-16 text-center text-white">
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
          className="text-lg md:text-xl mb-8"
        >
          Join contests, win prizes, and become a part of our thriving creative community.
        </motion.p>
        <Link
          to="/all-contest"
          className="btn btn-lg btn-primary"
        >
          Explore Contests
        </Link>
      </section>

    </div>
  );
};

export default ExtraSection;
