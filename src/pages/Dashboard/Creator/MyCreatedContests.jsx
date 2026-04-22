import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useCreatorContests from "../../../hooks/useCreatorContests";
import Loading from "../../Loading";
import AuthContext from "../../../providers/AuthContext";
import { declareWinner, deleteContest, getSubmissions } from "../../../api/contest_api";
import { motion } from "framer-motion";

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
            <div className="space-y-3 bg-gray-800 p-4 rounded-lg text-white">
                <p className="font-semibold">
                    Declare <span className="text-green-400">{email}</span> as winner?
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        className="btn btn-sm btn-outline border-gray-500 text-gray-300"
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-6"
        >
            <div className="flex gap-1">
                <div className="text-4xl">📋</div>
                <motion.h2
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
                >
                    My Created Contests
                </motion.h2>
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="card-gamified overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] font-bold text-white">
                                <th className="text-center">Title</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Participants</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((contest, index) => (
                                <motion.tr
                                    key={contest._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-gray-800 transition-colors"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <td className="font-semibold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">{contest.title}</td>
                                    <td>
                                        <span className={`badge ${contest.status === 'approved' ? 'badge-success' :
                                                contest.status === 'pending' ? 'badge-warning' :
                                                    'badge-error'
                                            }`}>
                                            {contest.status}
                                        </span>
                                    </td>
                                    <td className="text-center text-blue-400 font-semibold">
                                        {contest.participants.length}
                                    </td>
                                    <td className="space-x-2">
                                        {contest.status === "pending" && (
                                            <>
                                                <motion.button
                                                    className="btn btn-xs btn-outline border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                                                    onClick={() => handleEdit(contest._id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    className="btn btn-xs btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    onClick={() => handleDelete(contest._id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
                                            </>
                                        )}
                                        {contest.status === "approved" && (
                                            <motion.button
                                                className="btn btn-xs btn-outline border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                                                onClick={() => handleViewSubmissions(contest)}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                View Submissions
                                            </motion.button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal for submissions */}
            {modalOpen && selectedContest && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="card-gamified p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative"
                    >
                        <button
                            className="absolute top-4 right-4 text-2xl font-bold text-white hover:text-red-400"
                            onClick={() => setModalOpen(false)}
                        >
                            ✕
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-white">
                            {selectedContest.title} - Submissions
                        </h3>
                        {submissions.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No submissions yet.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Email</th>
                                            <th className="text-center">Submission Link</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((sub, index) => (
                                            <motion.tr
                                                key={sub.email}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-gray-800"
                                            >
                                                <td className="font-semibold text-white">{sub.name}</td>
                                                <td className="text-gray-300">{sub.email}</td>
                                                <td>
                                                    <a
                                                        href={sub.taskLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 underline hover:text-blue-300"
                                                    >
                                                        View Task
                                                    </a>
                                                </td>
                                                <td>
                                                    {!selectedContest.winnerEmail && (
                                                        <motion.button
                                                            className="btn btn-xs btn-success"
                                                            onClick={() => handleDeclareWinner(sub.email)}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Declare Winner
                                                        </motion.button>
                                                    )}
                                                    {selectedContest.winnerEmail === sub.email && (
                                                        <span className="text-green-400 font-semibold flex items-center gap-2">
                                                            🏆 Winner
                                                        </span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default MyCreatedContests;
