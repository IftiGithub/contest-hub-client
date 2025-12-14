import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import useWinningContests from "../../../hooks/useWinningContests";
import Loading from "../../Loading";

const MyWinningContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests, isLoading } = useWinningContests(user?.email);

    if (isLoading) return <Loading />;

    if (!contests || contests.length === 0) return <p>You haven’t won any contests yet.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contests.map((contest) => (
                <div key={contest._id} className="card bg-base-100 shadow">
                    <img src={contest.image} alt={contest.name} className="rounded-t-lg" />
                    <div className="p-4">
                        <h3 className="font-bold text-lg">{contest.name}</h3>
                        <p className="text-sm">Prize: ${contest.prize}</p>
                        <p className="text-sm">{contest.description?.slice(0, 100)}...</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyWinningContests;
