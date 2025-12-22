import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useCreatorContests from "../../../hooks/useCreatorContests";
import Loading from "../../Loading";
import AuthContext from "../../../providers/AuthContext";
import { declareWinner, deleteContest, getSubmissions } from "../../../api/contest_api";

const MyCreatedContests = () => {
    const { user } = useContext(AuthContext);
    const { data: contests = [], isLoading, refetch } = useCreatorContests(user?.email);
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContest, setSelectedContest] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    if (isLoading) return <Loading />;

    const handleEdit = (id) => {
        navigate(`/dashboard/edit-contest/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contest? Only pending contests can be deleted."
        );
        if (!confirmDelete) return;

        try {
            await deleteContest(id);
            toast.success("Contest deleted successfully!");
            refetch();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete contest");
        }
    };

    const handleViewSubmissions = async (contest) => {
        try {
            const data = await getSubmissions(contest._id);
            setSubmissions(data);
            setSelectedContest(contest);
            setModalOpen(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch submissions");
        }
    };

    const handleDeclareWinner = async (email) => {
        if (!selectedContest) return;

        toast((t) => (
            <div className="space-y-3">
                <p className="font-semibold">
                    Declare <span className="text-primary">{email}</span> as winner?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-sm btn-success"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await declareWinner(selectedContest._id, email);
                                toast.success("Winner declared successfully!");
                                setModalOpen(false);
                                refetch();
                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to declare winner");
                            }
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity, // stays until user acts
        });
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
                                            className="btn btn-xs btn-error mr-2"
                                            onClick={() => handleDelete(contest._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {contest.status === "approved" && (
                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => handleViewSubmissions(contest)}
                                    >
                                        View Submissions
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for submissions */}
            {modalOpen && selectedContest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-3/4 max-h-[80vh] overflow-y-auto p-6 relative">
                        <button
                            className="absolute top-2 right-2 btn btn-sm btn-circle"
                            onClick={() => setModalOpen(false)}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-4">{selectedContest.title} - Submissions</h3>
                        {submissions.length === 0 ? (
                            <p>No submissions yet.</p>
                        ) : (
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Submission Link</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => (
                                        <tr key={sub.email}>
                                            <td>{sub.name}</td>
                                            <td>{sub.email}</td>
                                            <td>
                                                <a
                                                    href={sub.taskLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline"
                                                >
                                                    View Task
                                                </a>
                                            </td>
                                            <td>
                                                {!selectedContest.winnerEmail && (
                                                    <button
                                                        className="btn btn-xs btn-success"
                                                        onClick={() => handleDeclareWinner(sub.email)}
                                                    >
                                                        Declare Winner
                                                    </button>
                                                )}
                                                {selectedContest.winnerEmail === sub.email && (
                                                    <span className="text-green-600 font-semibold">Winner</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCreatedContests;
