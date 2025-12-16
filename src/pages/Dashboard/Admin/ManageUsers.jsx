import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AuthContext from "../../../providers/AuthContext";
import { getAllUsers, updateUserRole } from "../../../api/user_api";
import Loading from "../../Loading";

const ManageUsers = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["allUsers"],
        queryFn: getAllUsers,
    });

    // Update role mutation
    const roleMutation = useMutation({
        mutationFn: updateUserRole,
        onSuccess: () => {
            queryClient.invalidateQueries(["allUsers"]);
        },
    });

    if (isLoading) return <Loading />;

    const handleRoleChange = (targetUser, newRole) => {
        // If admin changes HIS OWN role
        if (targetUser.email === user.email) {
            toast((t) => (
                <span>
                    ⚠️ Are you sure you want to change your role?
                    <div className="mt-2 flex gap-2">
                        <button
                            className="btn btn-sm btn-error"
                            onClick={() => {
                                roleMutation.mutate({
                                    id: targetUser._id,
                                    role: newRole,
                                });
                                toast.dismiss(t.id);
                                toast.success("Role updated. Redirecting...");
                                setTimeout(() => navigate("/"), 1200);
                            }}
                        >
                            Yes
                        </button>
                        <button
                            className="btn btn-sm"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            Cancel
                        </button>
                    </div>
                </span>
            ));
            return;
        }

        // Changing OTHER users
        roleMutation.mutate(
            { id: targetUser._id, role: newRole },
            {
                onSuccess: () => {
                    toast.success("User role updated");
                },
            }
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td className="capitalize">{u.role}</td>
                                <td>
                                    <select
                                        className="select select-sm select-bordered"
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChange(u, e.target.value)
                                        }
                                    >
                                        <option value="user">User</option>
                                        <option value="creator">Creator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
