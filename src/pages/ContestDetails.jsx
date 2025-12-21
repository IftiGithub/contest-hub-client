import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../providers/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { secureFetch } from "../api/secureFetch";
import toast from "react-hot-toast";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch contest
  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", id],
    queryFn: () => secureFetch(`http://localhost:3000/contests/${id}`),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (!contest) return <p className="text-center mt-10 text-red-500">Contest not found!</p>;

  const participants = Array.isArray(contest.participants) ? contest.participants : [];
  const hasJoined = user ? participants.some((p) => p.email === user.email) : false;
  const isContestEnded = new Date(contest.deadline) < new Date();
  const isCreator = contest.creatorEmail === user?.email;

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Start payment session
      const data = await secureFetch("http://localhost:3000/create-checkout-session", {
        method: "POST",
        body: { contestId: id },
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Unable to start payment");
      }
    } catch (err) {
      toast.error(err.message || "Payment failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img src={contest.image} alt={contest.title} className="w-full h-64 object-cover" />
      </div>
      <h2 className="text-3xl font-bold">{contest.title}</h2>
      <p className="text-gray-600">{contest.description}</p>
      <p className="font-semibold">
        Prize Money: <span className="text-green-600">${contest.prizeMoney}</span>
      </p>
      <p>Participants: {participants.length}</p>
      <p>Deadline: {new Date(contest.deadline).toLocaleDateString()} {new Date(contest.deadline).toLocaleTimeString()}</p>

      {contest.winnerName && (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="font-semibold">Winner: {contest.winnerName}</p>
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
    </div>
  );
};

export default ContestDetails;
