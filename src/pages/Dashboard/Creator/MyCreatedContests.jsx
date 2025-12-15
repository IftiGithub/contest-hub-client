import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import Loading from "../../Loading";
import useCreatorContests from "../../../hooks/useCreatorContests";

const MyCreatedContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests = [], isLoading } = useCreatorContests(user?.email);

    if (isLoading) return <Loading />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Created Contests</h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map(contest => (
                        <tr key={contest._id}>
                            <td>{contest.title}</td>
                            <td className="capitalize">{contest.status}</td>
                            <td>{contest.participants.length}</td>
                            <td>
                                {contest.status === "pending" && (
                                    <>
                                        <button className="btn btn-xs btn-warning mr-2">Edit</button>
                                        <button className="btn btn-xs btn-error">Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyCreatedContests;
