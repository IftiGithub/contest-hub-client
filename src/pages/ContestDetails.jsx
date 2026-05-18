import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../providers/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { secureFetch } from "../api/secureFetch";
import { updateContestStatusPublic } from "../api/contest_api"; // Add this import
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskLink, setTaskLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [hasAutoUpdated, setHasAutoUpdated] = useState(false); // Prevent multiple updates

  // Fetch contest
  const { data: contest, isLoading, refetch } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => secureFetch(`https://contest-hub-server.onrender.com/contests/${id}`),
    enabled: !!id,
  });

  // Mutation to update contest status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateContestStatusPublic(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["contest", id]);
      toast.success("Contest status updated");
    },
    onError: (error) => {
      console.error("Failed to update status:", error);
    },
  });

  // ===== Check and Update Contest Status =====
  useEffect(() => {
    if (!contest || hasAutoUpdated) return;

    const checkAndUpdateStatus = async () => {
      const now = new Date();
      const deadline = new Date(contest.deadline);
      const isDeadlinePassed = now > deadline;
      
      // Update status to "completed" if:
      // 1. Contest has a winner (winner declared) OR
      // 2. Deadline has passed AND contest is not already completed
      if ((contest.winnerName || isDeadlinePassed) && contest.status !== "completed") {
        setHasAutoUpdated(true);
        await updateStatusMutation.mutateAsync({ id: contest._id, status: "completed" });
      }
    };

    checkAndUpdateStatus();
  }, [contest, hasAutoUpdated]);

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

  // ✅ NEW: Check if contest has a winner
  const hasWinner = !!contest.winnerName;

  // ✅ NEW: Determine if contest is active (no winner AND not ended AND status is approved)
  const isActive = !hasWinner && !isContestEnded && contest.status === "approved";

  // ✅ NEW: Determine if user can join
  const canJoin = isActive && !hasJoined && !isCreator;

  // ✅ NEW: Determine if user can submit task
  const canSubmit = hasJoined && !isCreator && isActive && !hasWinner && !contest.submissions?.some(s => s.email === user?.email);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // ✅ Prevent registration if contest has winner
    if (hasWinner) {
      toast.error("This contest has already ended with a winner");
      return;
    }

    try {
      const data = await secureFetch(`https://contest-hub-server.onrender.com/create-checkout-session`, { method: "POST", body: { contestId: id } });
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

    // ✅ Prevent submission if contest has winner
    if (hasWinner) {
      toast.error("Cannot submit task - contest already has a winner");
      return;
    }

    setIsSubmitting(true);
    try {
      await secureFetch(`https://contest-hub-server.onrender.com/contests/${id}/submit-task`, { method: "POST", body: { taskLink } });
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
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                contest.status === "completed" 
                  ? "bg-gray-600 text-white" 
                  : contest.status === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}>
                {contest.status === "completed" ? "✓ Completed" : contest.status === "approved" ? "🔴 Active" : contest.status}
              </span>
            </div>
            {/* Winner Badge */}
            {hasWinner && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                  👑 Winner Declared
                </span>
              </div>
            )}
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

            {/* Task Instruction */}
            <motion.div
              className="card-modern p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span>📋</span> Task Instruction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {contest.taskInstruction || "No specific instructions provided. Please complete the task as described in the contest guidelines."}
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
                {!hasWinner && !isContestEnded && timeLeft !== "Contest Ended" && (
                  <p className="text-2xl font-bold text-[var(--accent-primary)]">
                    {timeLeft}
                  </p>
                )}
                {(hasWinner || timeLeft === "Contest Ended") && (
                  <p className="text-xl font-bold text-red-500">
                    {hasWinner ? "🏆 Contest Completed - Winner Declared" : "✓ Contest Ended"}
                  </p>
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
                      {contest.status === "completed" 
                        ? "✓ Completed"
                        : hasWinner
                          ? "🏆 Completed"
                          : isContestEnded
                            ? "✓ Ended"
                            : "🔴 Active"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 space-y-3">
                <motion.button
                  className={`btn-gamified w-full ${(!canJoin && !hasJoined && !isCreator) || contest.status === "completed" ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleRegister}
                  disabled={(!canJoin && !hasJoined && !isCreator) || contest.status === "completed"}
                  whileHover={canJoin ? { scale: 1.02 } : {}}
                  whileTap={canJoin ? { scale: 0.98 } : {}}
                >
                  {contest.status === "completed"
                    ? "✓ Contest Completed"
                    : hasWinner
                      ? "🏆 Contest Completed"
                      : isContestEnded
                        ? "⏱️ Contest Ended"
                        : hasJoined
                          ? "✅ Already Joined"
                          : isCreator
                            ? "👤 Creator"
                            : "🚀 Join Now"}
                </motion.button>

                {canSubmit && contest.status !== "completed" && (
                  <motion.button
                    className="w-full py-2.5 px-4 border-2 border-[var(--accent-secondary)] text-[var(--accent-secondary)] rounded-lg hover:bg-[var(--accent-secondary)]/10 font-medium transition-all"
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📤 Submit Task
                  </motion.button>
                )}

                {hasSubmitted && !hasWinner && contest.status !== "completed" && (
                  <div className="p-3 bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30 rounded-lg text-center">
                    <p className="text-sm font-medium text-[var(--accent-secondary)]">
                      ✓ Task Submitted
                    </p>
                  </div>
                )}

                {hasWinner && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <span>👑</span> Winner Announced!
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
                  </div>
                )}
              </div>
            </motion.div>
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
                  disabled={hasWinner || contest.status === "completed"}
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
                  disabled={isSubmitting || hasWinner || contest.status === "completed"}
                  className={`flex-1 btn-gamified ${(isSubmitting || hasWinner || contest.status === "completed") ? "opacity-50 cursor-not-allowed" : ""}`}
                  whileHover={(!isSubmitting && !hasWinner && contest.status !== "completed") ? { scale: 1.02 } : {}}
                  whileTap={(!isSubmitting && !hasWinner && contest.status !== "completed") ? { scale: 0.98 } : {}}
                >
                  {contest.status === "completed" || hasWinner
                    ? "🏆 Contest Completed"
                    : isSubmitting
                      ? "⏳ Submitting..."
                      : "✓ Submit"}
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