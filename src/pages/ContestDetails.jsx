import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import Loading from "./Loading.jsx";
import { getContestById } from "../api/contest_api.js";
import AuthContext from "../providers/AuthContext.jsx";

const ContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const { data: contest, isLoading } = useQuery({
        queryKey: ["contest", id],
        queryFn: () => getContestById(id),
        enabled: !!id, // only fetch if id exists
    });

    if (isLoading) return <Loading />;

    if (!contest) {
        return <p className="text-center mt-10 text-red-500">Contest not found!</p>;
    }

    const handleRegister = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        // TODO: Integrate payment logic here
        alert("Payment / Registration logic goes here");
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
            <button
                className={`btn btn-primary ${isContestEnded ? "btn-disabled" : ""}`}
                onClick={handleRegister}
                disabled={isContestEnded}
            >
                {isContestEnded ? "Contest Ended" : "Register / Pay"}
            </button>
        </div>
    );
};

export default ContestDetails;
