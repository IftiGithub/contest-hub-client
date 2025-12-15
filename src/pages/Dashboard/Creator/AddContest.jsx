import { useForm } from "react-hook-form";
import { useContext } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";

const AddContest = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        const contestData = {
            ...data,
            creatorEmail: user.email,
            creatorName: user.displayName,
        };

        const res = await fetch("http://localhost:3000/contests", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(contestData),
        });

        if (res.ok) {
            toast.success("Contest added! Waiting for admin approval.");
            reset();
        } else {
            toast.error("Failed to add contest");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded">
            <h2 className="text-2xl font-bold mb-4">Add New Contest</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <input {...register("title", { required: true })}
                    placeholder="Contest Title"
                    className="input input-bordered w-full" />

                <input {...register("image", { required: true })}
                    placeholder="Image URL"
                    className="input input-bordered w-full" />

                <textarea {...register("description", { required: true })}
                    placeholder="Contest Description"
                    className="textarea textarea-bordered w-full" />

                <textarea {...register("taskInstruction", { required: true })}
                    placeholder="Task Instruction"
                    className="textarea textarea-bordered w-full" />

                <select {...register("contestType", { required: true })}
                    className="select select-bordered w-full">
                    <option value="">Select Contest Type</option>
                    <option value="design">Design</option>
                    <option value="writing">Article Writing</option>
                    <option value="business">Business Idea</option>
                </select>

                <input type="number"
                    {...register("price", { required: true })}
                    placeholder="Entry Fee"
                    className="input input-bordered w-full" />

                <input type="number"
                    {...register("prizeMoney", { required: true })}
                    placeholder="Prize Money"
                    className="input input-bordered w-full" />

                <input type="date"
                    {...register("deadline", { required: true })}
                    className="input input-bordered w-full" />

                <button className="btn btn-primary w-full">
                    Add Contest
                </button>

            </form>
        </div>
    );
};

export default AddContest;
