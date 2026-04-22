import { useEffect, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import { secureFetch } from "../../../api/secureFetch";
import { motion } from "framer-motion";

const contestTypeOptions = [
    { value: "design", label: "Design" },
    { value: "writing", label: "Writing" },
    { value: "business", label: "Business Idea" },
    { value: "gaming", label: "Gaming" },
    { value: "music", label: "Music" },
    { value: "photography", label: "Photography" },
    { value: "idea", label: "Idea" },
];

const EditContest = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // 🔹 Fetch contest data on mount
    useEffect(() => {
        const fetchContest = async () => {
            try {
                setFetchError(false);
                // secureFetch returns parsed data directly
                const data = await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}`);
                
                console.log("Fetched contest data:", data);
                
                if (!data) {
                    toast.error("Failed to fetch contest");
                    navigate("/dashboard/my-contests");
                    return;
                }

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
                );
            } catch (error) {
                console.error("Fetch error:", error);
                setFetchError(true);
                toast.error(error.message || "Failed to fetch contest");
                navigate("/dashboard/my-contests");
            }
        };

        if (id) {
            fetchContest();
        }
    }, [id, navigate, setValue]);

    const onSubmit = async (data) => {
        try {
            if (!user) {
                toast.error("You must be logged in");
                return;
            }

            setIsLoading(true);

            const updatedData = {
                title: data.title,
                image: data.image,
                description: data.description,
                taskInstruction: data.taskInstruction,
                contestType: data.contestType,
                price: parseFloat(data.price),
                prizeMoney: parseFloat(data.prizeMoney),
                deadline: data.deadline,
            };

            console.log("Updating contest with data:", updatedData);

            // IMPORTANT: Don't stringify the body - secureFetch does it for you!
            // Don't add Content-Type header - secureFetch adds it automatically!
            const result = await secureFetch(`https://contest-hub-server-ashen-two.vercel.app/contests/${id}`, {
                method: "PATCH",
                body: updatedData, // Pass the object directly, not stringified
            });

            console.log("Update result:", result);

            toast.success("Contest updated successfully!");
            navigate("/dashboard/my-contests");
            
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message || "Failed to update contest");
        } finally {
            setIsLoading(false);
        }
    };

    if (fetchError) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center">
                <div className="card-gamified p-8">
                    <h3 className="text-2xl font-bold text-red-500 mb-4">Failed to Load Contest</h3>
                    <p className="text-gray-400 mb-6">Unable to fetch contest details. Please try again later.</p>
                    <button 
                        onClick={() => navigate("/dashboard/my-contests")}
                        className="btn-gamified"
                    >
                        Back to My Contests
                    </button>
                </div>
            </div>
        );
    }

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
                        {...register("title", { required: "Contest title is required" })}
                        placeholder="Contest Title"
                        className="input-gamified w-full"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <input
                        {...register("image", { required: "Image URL is required" })}
                        placeholder="Image URL"
                        className="input-gamified w-full"
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        placeholder="Contest Description"
                        className="textarea-gamified w-full h-24"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <textarea
                        {...register("taskInstruction", { required: "Task instruction is required" })}
                        placeholder="Task Instruction"
                        className="textarea-gamified w-full h-24"
                    />
                    {errors.taskInstruction && <p className="text-red-500 text-sm mt-1">{errors.taskInstruction.message}</p>}
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <select
                        {...register("contestType", { required: "Contest type is required" })}
                        className="select-gamified w-full"
                    >
                        <option value="" className="bg-gray-800">Select Contest Type</option>
                        {contestTypeOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {errors.contestType && (
                        <p className="text-red-500 text-sm mt-1">{errors.contestType.message}</p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                    >
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", { 
                                required: "Entry fee is required", 
                                min: { value: 0, message: "Fee must be >= 0" },
                                valueAsNumber: true
                            })}
                            placeholder="Entry Fee"
                            className="input-gamified w-full"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <input
                            type="number"
                            step="0.01"
                            {...register("prizeMoney", { 
                                required: "Prize money is required", 
                                min: { value: 0, message: "Prize must be >= 0" },
                                valueAsNumber: true
                            })}
                            placeholder="Prize Money"
                            className="input-gamified w-full"
                        />
                        {errors.prizeMoney && <p className="text-red-500 text-sm mt-1">{errors.prizeMoney.message}</p>}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <input
                        type="date"
                        {...register("deadline", { required: "Deadline is required" })}
                        className="input-gamified w-full"
                    />
                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>}
                </motion.div>

                <div className="flex gap-4">
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="btn-gamified flex-1 disabled:opacity-50"
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? "Updating..." : "Update Contest"}
                    </motion.button>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                        className="btn-gamified-secondary flex-1"
                        type="button"
                        onClick={() => navigate("/dashboard/my-contests")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Cancel
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
};

export default EditContest;