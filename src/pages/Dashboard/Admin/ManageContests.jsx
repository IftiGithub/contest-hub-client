import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAdminContests from "../../../hooks/useAdminContests";
import { deleteContest, updateContestStatus, } from "../../../api/contest_api";
import { motion } from "framer-motion";

const ManageContests = () => {
    const { data: contests = [] } = useAdminContests();
    const queryClient = useQueryClient();

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => updateContestStatus(id, status),
        onSuccess: () => {
            toast.success("Contest status updated");
            queryClient.invalidateQueries(["admin-contests"]);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteContest,
        onSuccess: () => {
            toast.success("Contest deleted");
            queryClient.invalidateQueries(["admin-contests"]);
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-6"
        >
            <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
            >
                ⚙️ Manage Contests
            </motion.h2>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="card-gamified overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                                <th className="text-center">Title</th>
                                <th className="text-center">Creator</th>
                                <th className="text-center">Status</th>
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
                                    <td className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{contest.title}</td>
                                    <td className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{contest.creatorEmail}</td>
                                    <td>
                                        <span className={`badge ${
                                            contest.status === 'approved' ? 'badge-success' :
                                            contest.status === 'pending' ? 'badge-warning' :
                                            contest.status === 'rejected' ? 'badge-error' :
                                            'badge-info'
                                        }`}>
                                            {contest.status}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        {contest.status === "pending" && (
                                            <>
                                                <motion.button
                                                    className="btn btn-xs btn-success"
                                                    onClick={() =>
                                                        statusMutation.mutate({ id: contest._id, status: "approved" })
                                                    }
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Approve
                                                </motion.button>

                                                <motion.button
                                                    className="btn btn-xs btn-warning"
                                                    onClick={() =>
                                                        statusMutation.mutate({ id: contest._id, status: "rejected" })
                                                    }
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Reject
                                                </motion.button>
                                            </>
                                        )}

                                        <motion.button
                                            className="btn btn-xs btn-error"
                                            onClick={() => deleteMutation.mutate(contest._id)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Delete
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ManageContests;
