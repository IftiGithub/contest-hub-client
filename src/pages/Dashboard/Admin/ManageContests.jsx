import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAdminContests from "../../../hooks/useAdminContests";
import { deleteContest, updateContestStatus } from "../../../api/contest_api";

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
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage Contests</h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Creator</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {contests.map(contest => (
                        <tr key={contest._id}>
                            <td>{contest.title}</td>
                            <td>{contest.creatorEmail}</td>
                            <td className="capitalize">{contest.status}</td>
                            <td>
                                {contest.status === "pending" && (
                                    <>
                                        <button
                                            className="btn btn-xs btn-success mr-2"
                                            onClick={() =>
                                                statusMutation.mutate({ id: contest._id, status: "approved" })
                                            }
                                        >
                                            Approve
                                        </button>

                                        <button
                                            className="btn btn-xs btn-warning mr-2"
                                            onClick={() =>
                                                statusMutation.mutate({ id: contest._id, status: "rejected" })
                                            }
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                <button
                                    className="btn btn-xs btn-error"
                                    onClick={() => deleteMutation.mutate(contest._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageContests;
