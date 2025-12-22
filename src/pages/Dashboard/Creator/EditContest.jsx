import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import { secureFetch } from "../../../api/secureFetch";

const EditContest = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue } = useForm();

    // 🔹 Fetch contest data on mount
    useEffect(() => {
        const fetchContest = async () => {
            try {
                const res = await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}`);
                if (!res.ok) {
                    const err = await res.json();
                    toast.error(err.message || "Failed to fetch contest");
                    navigate("/dashboard/my-contests");
                    return;
                }

                const data = await res.json();

                if (data.status !== "pending") {
                    toast.error("You can only edit pending contests");
                    navigate("/dashboard/my-contests");
                    return;
                }

                // Populate form with existing contest data
                setValue("title", data.title);
                setValue("image", data.image);
                setValue("description", data.description);
                setValue("taskInstruction", data.taskInstruction);
                setValue("contestType", data.contestType);
                setValue("price", data.price);
                setValue("prizeMoney", data.prizeMoney);
                setValue(
                    "deadline",
                    new Date(data.deadline).toISOString().slice(0, 10)
                ); // YYYY-MM-DD
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch contest");
            }
        };

        fetchContest();
    }, [id, navigate, setValue]);

    const onSubmit = async (data) => {
        try {
            if (!user) {
                toast.error("You must be logged in");
                return;
            }

            const updatedData = {
                ...data,
                creatorEmail: user.email,
                creatorName: user.displayName || "Unknown",
                deadline: data.deadline,
            };

            const res = await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}`, {
                method: "PATCH",
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                toast.success("Contest updated successfully!");
                navigate("/dashboard/my-contests");
            } else {
                const err = await res.json();
                toast.error(err.message || "Failed to update contest");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update contest");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded">
            <h2 className="text-2xl font-bold mb-4">Edit Contest</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    {...register("title", { required: true })}
                    placeholder="Contest Title"
                    className="input input-bordered w-full"
                />

                <input
                    {...register("image", { required: true })}
                    placeholder="Image URL"
                    className="input input-bordered w-full"
                />

                <textarea
                    {...register("description", { required: true })}
                    placeholder="Contest Description"
                    className="textarea textarea-bordered w-full"
                />

                <textarea
                    {...register("taskInstruction", { required: true })}
                    placeholder="Task Instruction"
                    className="textarea textarea-bordered w-full"
                />

                <select
                    {...register("contestType", { required: true })}
                    className="select select-bordered w-full"
                >
                    <option value="">Select Contest Type</option>
                    <option value="design">Design</option>
                    <option value="writing">Article Writing</option>
                    <option value="business">Business Idea</option>
                </select>

                <input
                    type="number"
                    {...register("price", { required: true })}
                    placeholder="Entry Fee"
                    className="input input-bordered w-full"
                />

                <input
                    type="number"
                    {...register("prizeMoney", { required: true })}
                    placeholder="Prize Money"
                    className="input input-bordered w-full"
                />

                <input
                    type="date"
                    {...register("deadline", { required: true })}
                    className="input input-bordered w-full"
                />

                <button className="btn btn-primary w-full">Update Contest</button>
            </form>
        </div>
    );
};

export default EditContest;
