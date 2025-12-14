import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import useParticipatedContests from "../../../hooks/useParticipatedContests";
import Loading from "../../Loading";

const MyParticipatedContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests, isLoading } = useParticipatedContests(user?.email);

    if (isLoading) return <Loading />;

    if (!contests || contests.length === 0) return <p>No contests participated yet.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contests.map((contest) => (
                <div key={contest._id} className="card bg-base-100 shadow">
                    <img src={contest.image} alt={contest.name} className="rounded-t-lg" />
                    <div className="p-4">
                        <h3 className="font-bold text-lg">{contest.name}</h3>
                        <p className="text-sm">Participants: {contest.participants?.length || 0}</p>
                        <p className="text-sm">{contest.description?.slice(0, 100)}...</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyParticipatedContests;
