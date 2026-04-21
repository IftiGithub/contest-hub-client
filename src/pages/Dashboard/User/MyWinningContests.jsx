import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import useWinningContests from "../../../hooks/useWinningContests";
import Loading from "../../Loading";
import { motion } from "framer-motion";

const MyWinningContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests, isLoading } = useWinningContests(user?.email);

    if (isLoading) return <Loading />;

    if (!contests || contests.length === 0) return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
        >
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
            >
                🏆
            </motion.div>
            <p className="text-gray-400 text-xl">You haven't won any contests yet.</p>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-6"
        >
            <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
            >
                🏆 My Winning Contests
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contests.map((contest, index) => (
                    <motion.div
                        key={contest._id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                        className="card-gamified overflow-hidden"
                    >
                        <motion.img
                            src={contest.image || "/default-contest.jpg"}
                            alt={contest.title || "Contest Image"}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <div className="p-6">
                            <h3 className="font-bold text-xl text-white mb-2">{contest.title || "Untitled Contest"}</h3>
                            <p className="text-green-400 font-semibold text-lg mb-3">Prize: ${contest.prizeMoney ?? "N/A"}</p>
                            <p className="text-gray-300 text-sm">
                                {contest.description ? contest.description.slice(0, 100) + "..." : "No description available."}
                            </p>
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="mt-4 text-center"
                            >
                                <span className="badge badge-primary text-lg px-4 py-2">🏆 Winner</span>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MyWinningContests;
