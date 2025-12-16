import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import Loading from "./Loading.jsx";
import { getContestById } from "../api/contest_api.js";
import AuthContext from "../providers/AuthContext.jsx";
import toast from "react-hot-toast";

const ContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isJoined = user && contest.participants.includes(user.email);


    const { data: contest, isLoading } = useQuery({
        queryKey: ["contest", id],
        queryFn: () => getContestById(id),
        enabled: !!id, // only fetch if id exists
    });

    if (isLoading) return <Loading />;

    if (!contest) {
        return <p className="text-center mt-10 text-red-500">Contest not found!</p>;
    }

    const handleRegister = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        // Prevent creator from joining
        if (contest.creatorEmail === user.email) {
            return toast.error("You cannot join your own contest");
        }

        // Prevent duplicate join
        if (contest.participants.includes(user.email)) {
            return toast.error("You already joined this contest");
        }

        try {
            await fetch(`http://localhost:3000/contests/register/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: user.email }),
            });

            alert("Successfully registered!");
            navigate(0); // refresh page data
        } catch (error) {
            toast.error("Registration failed",error);
        }
    };


    const isContestEnded = new Date(contest.deadline) < new Date();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Contest Banner */}
            <div className="rounded-lg overflow-hidden shadow-lg">
                <img src={contest.image} alt={contest.title} className="w-full h-64 object-cover" />
            </div>

            {/* Contest Info */}
            <h2 className="text-3xl font-bold">{contest.title}</h2>
            <p className="text-gray-600">{contest.description}</p>
            <p className="font-semibold">
                Prize Money: <span className="text-green-600">${contest.prizeMoney}</span>
            </p>
            <p>Participants: {contest.participants.length}</p>
            <p>
                Deadline:{" "}
                {new Date(contest.deadline).toLocaleDateString()}{" "}
                {new Date(contest.deadline).toLocaleTimeString()}
            </p>

            {/* Winner Info */}
            {contest.winnerName && (
                <div className="bg-green-100 p-4 rounded-lg">
                    <p className="font-semibold">Winner: {contest.winnerName}</p>
                </div>
            )}

            {/* Action Button */}
            {/* Action Section */}
            {!user && (
                <button className="btn btn-primary" onClick={() => navigate("/login")}>
                    Login to Join
                </button>
            )}

            {user && !isJoined && !isContestEnded && (
                <button className="btn btn-primary" onClick={handleRegister}>
                    Register / Pay
                </button>
            )}

            {user && isJoined && !isContestEnded && (
                <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="font-semibold text-blue-700">
                        ✅ You have already joined this contest
                    </p>
                </div>
            )}

            {isContestEnded && (
                <button className="btn btn-disabled">Contest Ended</button>
            )}

        </div>
    );
};

export default ContestDetails;
