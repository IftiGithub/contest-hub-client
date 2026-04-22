import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import AuthContext from "../../../providers/AuthContext";
import { getAllUsers, updateUserRole } from "../../../api/user_api";
import Loading from "../../Loading";
import { motion } from "framer-motion";

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
                <span className="text-white">
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
                            className="btn btn-sm btn-outline border-gray-500 text-gray-300"
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="p-6"
        >
            <div className="flex gap-1 mb-1 items-center">
                <div className="text-4xl">👥</div>
                <motion.h2
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                    Manage Users
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
                            <tr className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                                <th className="text-center">Name</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Role</th>
                                <th className="text-center">Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <motion.tr
                                    key={u._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-gray-800 transition-colors"
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <td className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
                                        {u.photoURL && (
                                            <motion.img
                                                src={u.photoURL}
                                                alt={u.name}
                                                className="w-8 h-8 rounded-full border border-gray-600"
                                                whileHover={{ scale: 1.1 }}
                                            />
                                        )}
                                        {u.name}
                                    </td>
                                    <td className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-error' :
                                                u.role === 'creator' ? 'badge-warning' :
                                                    'badge-info'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <motion.select
                                            className="select select-sm select-bordered bg-gray-800 border-gray-600 text-white"
                                            value={u.role}
                                            onChange={(e) =>
                                                handleRoleChange(u, e.target.value)
                                            }
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <option value="user" className="bg-gray-800">User</option>
                                            <option value="creator" className="bg-gray-800">Creator</option>
                                            <option value="admin" className="bg-gray-800">Admin</option>
                                        </motion.select>
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

export default ManageUsers;
