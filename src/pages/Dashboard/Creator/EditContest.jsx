import { useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import { secureFetch } from "../../../api/secureFetch";
import { motion } from "framer-motion";

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto p-6"
        >
            <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
                ✏️ Edit Contest
            </motion.h2>

            <motion.form
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit(onSubmit)}
                className="card-gamified p-8 space-y-6"
            >
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <input
                        {...register("title", { required: true })}
                        placeholder="Contest Title"
                        className="input-gamified w-full"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <input
                        {...register("image", { required: true })}
                        placeholder="Image URL"
                        className="input-gamified w-full"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <textarea
                        {...register("description", { required: true })}
                        placeholder="Contest Description"
                        className="textarea-gamified w-full h-24"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <textarea
                        {...register("taskInstruction", { required: true })}
                        placeholder="Task Instruction"
                        className="textarea-gamified w-full h-24"
                    />
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <select
                        {...register("contestType", { required: true })}
                        className="select-gamified w-full"
                    >
                        <option value="" className="bg-gray-800">Select Contest Type</option>
                        <option value="design" className="bg-gray-800">Design</option>
                        <option value="writing" className="bg-gray-800">Article Writing</option>
                        <option value="business" className="bg-gray-800">Business Idea</option>
                    </select>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        <input
                            type="number"
                            {...register("price", { required: true })}
                            placeholder="Entry Fee"
                            className="input-gamified w-full"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <input
                            type="number"
                            {...register("prizeMoney", { required: true })}
                            placeholder="Prize Money"
                            className="input-gamified w-full"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <input
                        type="date"
                        {...register("deadline", { required: true })}
                        className="input-gamified w-full"
                    />
                </motion.div>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="btn-gamified w-full"
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Update Contest
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default EditContest;
