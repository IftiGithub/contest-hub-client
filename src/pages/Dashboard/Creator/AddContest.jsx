import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { secureFetch } from "../../../api/secureFetch";
import { motion } from "framer-motion";

const AddContest = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm();
  const [customContestType, setCustomContestType] = useState("");
  
  const selectedContestType = watch("contestType");

  const addContestMutation = useMutation({
    mutationFn: (data) =>
      secureFetch("https://contest-hub-server-ashen-two.vercel.app/contests", { method: "POST", body: data }),
    onSuccess: () => {
      toast.success("Contest added! Waiting for admin approval.");
      reset();
      setCustomContestType("");
      queryClient.invalidateQueries({ queryKey: ["contests"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add contest");
    },
  });

  const onSubmit = (data) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    // Determine final contest type
    let finalContestType = data.contestType;
    if (data.contestType === "custom" && customContestType.trim()) {
      finalContestType = customContestType.trim();
    }

    const contestData = {
      ...data,
      contestType: finalContestType,
      creatorEmail: user.email,
      creatorName: user.displayName || "Unknown",
      creatorAvatar: user.photoURL || "https://randomuser.me/api/portraits/men/68.jpg",
      deadline: data.deadline,
    };

    addContestMutation.mutate(contestData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card-gamified p-8"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
        >
          ➕ Add New Contest
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Contest Title</span>&nbsp;
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Contest Title"
              className="input-gamified text-white"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Image URL</span> &nbsp;
            </label>
            <input
              {...register("image", { required: true })}
              placeholder="Image URL"
              className="input-gamified text-white"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Contest Description</span>
            </label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Contest Description"
              className="textarea textarea-bordered w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={4}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Task Instruction</span>
            </label>
            <textarea
              {...register("taskInstruction", { required: true })}
              placeholder="Task Instruction"
              className="textarea textarea-bordered w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              rows={4}
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Contest Type</span>
            </label>
            <select
              {...register("contestType", { required: true })}
              className="select select-bordered w-full bg-gray-800 border-gray-600 text-white"
            >
              <option value="" className="bg-gray-800 text-white">Select Contest Type</option>
              <option value="design" className="bg-gray-800 text-white">Design</option>
              <option value="writing" className="bg-gray-800 text-white">Writing</option>
              <option value="idea" className="bg-gray-800 text-white">Idea</option>
              <option value="gaming" className="bg-gray-800 text-white">Gaming</option>
              <option value="music" className="bg-gray-800 text-white">Music</option>
              <option value="photography" className="bg-gray-800 text-white">Photography</option>
              <option value="custom" className="bg-gray-800 text-white">Custom (Enter your own)</option>
            </select>
          </motion.div>

          {selectedContestType === "custom" && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Custom Contest Type</span>
              </label>
              <input
                type="text"
                value={customContestType}
                onChange={(e) => setCustomContestType(e.target.value)}
                placeholder="Enter your custom contest type"
                className="input-gamified text-white"
                required={selectedContestType === "custom"}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Entry Fee ($)</span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="Entry Fee"
                className="input-gamified text-white"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Prize Money ($)</span> &nbsp;
              </label>
              <input
                type="number"
                {...register("prizeMoney", { required: true })}
                placeholder="Prize Money"
                className="input-gamified text-white"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent font-bold">Deadline</span> &nbsp;
            </label>
            <input
              type="date"
              {...register("deadline", { required: true })}
              className="input-gamified text-white"
            />
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="btn-gamified w-full"
            disabled={addContestMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {addContestMutation.isPending ? "Adding Contest..." : "Add Contest"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddContest;