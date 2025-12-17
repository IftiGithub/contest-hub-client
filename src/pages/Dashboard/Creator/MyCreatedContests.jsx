import { useContext } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useCreatorContests from "../../../hooks/useCreatorContests";
import { deleteContest } from "../../../api/contest_api";
import Loading from "../../Loading";
import AuthContext from "../../../providers/AuthContext";

const MyCreatedContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests = [], isLoading, refetch } = useCreatorContests(user?.email);
    const navigate = useNavigate();

    if (isLoading) return <Loading />;

    const handleEdit = (id) => {
        navigate(`/dashboard/edit-contest/${id}`); // navigates to EditContest page
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contest? Only pending contests can be deleted."
        );
        if (!confirmDelete) return;

        try {
            await deleteContest(id);
            toast.success("Contest deleted successfully!");
            refetch(); // refresh list after deletion
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete contest");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Created Contests</h2>

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Participants</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest) => (
                        <tr key={contest._id}>
                            <td>{contest.title}</td>
                            <td className="capitalize">{contest.status}</td>
                            <td>{contest.participants.length}</td>
                            <td>
                                {contest.status === "pending" && (
                                    <>
                                        <button
                                            className="btn btn-xs btn-warning mr-2"
                                            onClick={() => handleEdit(contest._id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDelete(contest._id)}
                                        >
                                            Delete
                                        </button>
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
