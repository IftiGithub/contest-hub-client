import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../providers/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { secureFetch } from "../api/secureFetch";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskLink, setTaskLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch contest
  const { data: contest, isLoading, refetch } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}`),
    enabled: !!id,
  });

  // ===== Live Countdown =====
  useEffect(() => {
    if (!contest?.deadline || contest?.winnerName) return;

    const deadlineTime = new Date(contest.deadline).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = deadlineTime - now;

      if (diff <= 0) {
        setTimeLeft("Contest Ended");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [contest?.deadline, contest?.winnerName]);

  if (isLoading) return <Loading />;

  if (!contest)
    return (
      <p className="text-center mt-10 text-red-400">Contest not found!</p>
    );

  const participants = Array.isArray(contest.participants) ? contest.participants : [];
  const hasJoined = user
    ? participants.some((p) => (p.email ? p.email === user.email : p === user.email))
    : false;
  const isContestEnded = new Date(contest.deadline) < new Date();
  const isCreator = contest.creatorEmail === user?.email;

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const data = await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/create-checkout-session`, { method: "POST", body: { contestId: id } });
      if (data?.url) window.location.href = data.url;
      else toast.error("Unable to start payment");
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  const handleSubmitTask = async () => {
    if (!taskLink.trim()) {
      toast.error("Please provide a valid task link or description");
      return;
    }
    setIsSubmitting(true);
    try {
      await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}/submit-task`, { method: "POST", body: { taskLink } });
      toast.success("Task submitted successfully!");
      setIsModalOpen(false);
      setTaskLink("");
      refetch();
    } catch (error) {
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSubmitted = contest.submissions?.some(s => s.email === user?.email);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[var(--bg-primary)] px-4 py-16 md:py-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="relative rounded-2xl overflow-hidden mb-12 group"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-72 md:h-96 overflow-hidden">
            <motion.img
              src={contest.image}
              alt={contest.title}
              className="w-full h-full object-cover group-hover:scale-105"
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="badge-gamified">{contest.contestType}</span>
            </div>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{contest.title}</h1>
            <p className="text-gray-200 text-sm">By {contest.creatorName}</p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              className="card-modern p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span>📝</span> About This Contest
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {contest.description}
              </p>
            </motion.div>

            {/* Contest Details */}
            <motion.div
              className="grid md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card-modern p-6 text-center">
                <div className="text-4xl mb-2">💰</div>
                <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Prize Pool</h3>
                <p className="text-3xl font-bold text-gradient">${contest.prizeMoney}</p>
              </div>
              <div className="card-modern p-6 text-center">
                <div className="text-4xl mb-2">👥</div>
                <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-2">Participants</h3>
                <p className="text-3xl font-bold text-gradient">{participants.length}</p>
              </div>
            </motion.div>

            {/* Deadline Info */}
            <motion.div
              className="card-modern p-8 bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span>⏰</span> Time Remaining
              </h3>
              <div className="space-y-3">
                <p className="text-[var(--text-secondary)] text-sm">
                  Deadline: {new Date(contest.deadline).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                {!contest.winnerName && timeLeft !== "Contest Ended" && (
                  <p className="text-2xl font-bold text-[var(--accent-primary)]">
                    {timeLeft}
                  </p>
                )}
                {timeLeft === "Contest Ended" && (
                  <p className="text-xl font-bold text-red-500">✓ Contest Ended</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              className="card-modern p-6 sticky top-20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)]">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Contest Type</p>
                    <p className="font-semibold text-[var(--text-primary)]">{contest.contestType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)]">
                  <span className="text-2xl">👨‍💻</span>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Created By</p>
                    <p className="font-semibold text-[var(--text-primary)]">{contest.creatorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">Status</p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {isContestEnded ? "✓ Ended" : "🔴 Active"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 space-y-3">
                <motion.button
                  className="btn-gamified w-full"
                  onClick={handleRegister}
                  disabled={isContestEnded || hasJoined || isCreator}
                  whileHover={isContestEnded || hasJoined || isCreator ? {} : { scale: 1.02 }}
                  whileTap={isContestEnded || hasJoined || isCreator ? {} : { scale: 0.98 }}
                >
                  {isContestEnded
                    ? "⏱️ Contest Ended"
                    : hasJoined
                      ? "✅ Already Joined"
                      : isCreator
                        ? "👤 Creator"
                        : "🚀 Join Now"}
                </motion.button>

                {hasJoined && !isContestEnded && !isCreator && !hasSubmitted && (
                  <motion.button
                    className="w-full py-2.5 px-4 border-2 border-[var(--accent-secondary)] text-[var(--accent-secondary)] rounded-lg hover:bg-[var(--accent-secondary)]/10 font-medium transition-all"
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📤 Submit Task
                  </motion.button>
                )}

                {hasSubmitted && (
                  <div className="p-3 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-[var(--accent-secondary)]">
                      ✓ Task Submitted
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Winner Section */}
            {contest.winnerName && (
              <motion.div
                className="card-modern p-6 bg-gradient-to-br from-[#facc15]/10 to-[#f59e0b]/10 border border-[#facc15]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <span>👑</span> Winner
                </h3>
                <div className="flex items-center gap-4">
                  {contest.winnerImage && (
                    <motion.img
                      src={contest.winnerImage}
                      alt={contest.winnerName}
                      className="w-16 h-16 rounded-full border-2 border-[#facc15] object-cover"
                      whileHover={{ scale: 1.1 }}
                    />
                  )}
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{contest.winnerName}</p>
                    <p className="text-sm text-gradient">🏆 Prize Winner</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Submit Task Modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isModalOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${isModalOpen ? "" : "pointer-events-none"}`}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            className="modal-gamified w-full max-w-md p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isModalOpen ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>📤</span> Submit Your Task
              </h2>
              <motion.button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl"
                whileHover={{ rotate: 90 }}
              >
                ×
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Task Link / Description
                </label>
                <textarea
                  className="input-gamified w-full resize-none"
                  rows={5}
                  placeholder="Paste your task link or describe your submission..."
                  value={taskLink}
                  onChange={(e) => setTaskLink(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border-2 border-[var(--border-medium)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleSubmitTask}
                  disabled={isSubmitting}
                  className={`flex-1 btn-gamified ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={isSubmitting ? {} : { scale: 1.02 }}
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                >
                  {isSubmitting ? "⏳ Submitting..." : "✓ Submit"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContestDetails;
