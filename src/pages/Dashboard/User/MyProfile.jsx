import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import useDbUser from "../../../hooks/useDbUser";
import { updateUser } from "../../../api/user_api";

const MyProfile = () => {
    const { user } = useContext(AuthContext);
    const { data: dbUser, isLoading } = useDbUser(user?.email);

    const queryClient = useQueryClient();

    const { register, handleSubmit } = useForm({
        values: {
            name: dbUser?.name || "",
            photoURL: dbUser?.photoURL || "",
            bio: dbUser?.bio || "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data) => updateUser(user.email, data),

        onSuccess: () => {
            toast.success("Profile updated successfully 🎉");
            queryClient.invalidateQueries(["user", user.email]);
        },

        onError: () => {
            toast.error("Failed to update profile ❌");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    if (isLoading) return null;

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <label className="text-2xl">Name</label><br></br>
                <input
                    className="input input-bordered w-full"
                    placeholder="Name"
                    {...register("name")}
                />
                <label className="text-2xl">Image</label><br></br>
                <input
                    className="input input-bordered w-full"
                    placeholder="Photo URL"
                    {...register("photoURL")}
                />
                <label className="text-2xl">Bio</label>
                <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Bio"
                    {...register("bio")}
                ></textarea>

                <button className="btn btn-primary" disabled={mutation.isPending}>
                    {mutation.isPending ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default MyProfile;
