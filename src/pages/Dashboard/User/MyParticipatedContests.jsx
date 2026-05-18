import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import { secureFetch } from "../../../api/secureFetch";
import Loading from "../../Loading";
import { motion } from "framer-motion";
import { Link } from "react-router";

const MyParticipatedContests = () => {
  const { user } = useContext(AuthContext);

  const { data: contests = [], isLoading, isError, error } = useQuery({
    queryKey: ["participatedContests", user?.email],
    queryFn: () => secureFetch(`https://contest-hub-server.onrender.com/participated-contests/${user.email}`),
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-400">{error.message}</p>;
  if (!contests.length) return (
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
        🎯
      </motion.div>
      <p className="text-gray-400 text-xl">You have not joined any contests yet.</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="space-y-6 p-6"
    >
      <div className="flex gap-1 items-center">
        <div className="text-4xl">🎯</div>
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          My Participated Contests
        </motion.h2>
      </div>

      <div className="grid gap-6">
        {contests.map((contest, index) => (
          <motion.div
            key={contest._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="card-gamified p-6"
          >
            <div className="flex items-start gap-4">
              <motion.img
                src={contest.image}
                alt={contest.title}
                className="w-20 h-20 rounded-lg object-cover"
                whileHover={{ scale: 1.05 }}
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">{contest.title}</h3>
                <p className="text-gray-300 mb-3">{contest.description?.slice(0, 100)}...</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>⏰ Deadline: {new Date(contest.deadline).toLocaleDateString()}</span>
                  <span>👥 Participants: {contest.participants?.length || 0}</span>
                  <span className="text-green-400">💰 ${contest.prizeMoney}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={`/contest/${contest._id}`}
                    className="btn btn-outline border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    View Contest
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyParticipatedContests;
