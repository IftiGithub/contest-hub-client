import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../providers/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { secureFetch } from "../api/secureFetch";
import toast from "react-hot-toast";
import { div } from "framer-motion/client";

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
    queryFn: () => secureFetch(`http://localhost:3000/contests/${id}`),
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
      <p className="text-center mt-10 text-red-500">Contest not found!</p>
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
      const data = await secureFetch(`http://localhost:3000/create-checkout-session`, { method: "POST", body: { contestId: id } });
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
      await secureFetch(`http://localhost:3000/contests/${id}/submit-task`, { method: "POST", body: { taskLink } });
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img src={contest.image} alt={contest.title} className="w-full h-64 object-cover" />
      </div>

      <h2 className="text-3xl font-bold">{contest.title}</h2>
      <p className="text-gray-600">{contest.description}</p>
      <p className="font-semibold">Prize Money: <span className="text-green-600">${contest.prizeMoney}</span></p>
      <p>Participants: {participants.length}</p>
      <p>
        Deadline: {new Date(contest.deadline).toLocaleDateString()}{" "}
        {new Date(contest.deadline).toLocaleTimeString()}
      </p>
      {/* Show countdown only if no winner */}
      {!contest.winnerName && (
        <p className="text-lg font-bold text-red-600">{timeLeft}</p>
      )}

      <div className="text-center text-4xl font-bold">Winner</div>
      {contest.winnerName && (
        <div className="bg-green-100 p-4 rounded-lg flex items-center gap-3">
          {contest.winnerImage && <img src={contest.winnerImage} alt={contest.winnerName} className="w-16 h-16 rounded-full" />}
          <p className="font-extrabold">{contest.winnerName}</p>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={handleRegister}
        disabled={isContestEnded || hasJoined || isCreator}
      >
        {isContestEnded
          ? "Contest Ended"
          : hasJoined
            ? "Already Joined"
            : isCreator
              ? "Creator Cannot Join"
              : "Register / Pay"}
      </button>

      {hasJoined && !isContestEnded && !isCreator && !hasSubmitted && (
        <button className="btn btn-success ml-4" onClick={() => setIsModalOpen(true)}>
          Submit Task
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-xl font-bold" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h3 className="text-xl font-semibold mb-4">Submit Your Task</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              placeholder="Enter task link..."
              value={taskLink}
              onChange={(e) => setTaskLink(e.target.value)}
            />
            <button
              className={`btn btn-primary w-full ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSubmitTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {hasSubmitted && (
        <p className="mt-4 text-blue-600 font-semibold">
          You have already submitted your task.
        </p>
      )}
    </div>
  );
};

export default ContestDetails;
