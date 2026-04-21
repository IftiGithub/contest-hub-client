import { useForm } from "react-hook-form";
import { useContext } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { secureFetch } from "../../../api/secureFetch";
import { motion } from "framer-motion";

const AddContest = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const addContestMutation = useMutation({
    mutationFn: (data) =>
      secureFetch("https://contest-hub-server-ashen-two.vercel.app/contests", { method: "POST", body: data }),
    onSuccess: () => {
      toast.success("Contest added! Waiting for admin approval.");
      reset();
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

    const contestData = {
      ...data,
      creatorEmail: user.email,
      creatorName: user.displayName || "Unknown",
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
          className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
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
              <span className="label-text text-white">Contest Title</span>
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Contest Title"
              className="input-gamified"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text text-white">Image URL</span>
            </label>
            <input
              {...register("image", { required: true })}
              placeholder="Image URL"
              className="input-gamified"
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text text-white">Contest Description</span>
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
              <span className="label-text text-white">Task Instruction</span>
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
              <span className="label-text text-white">Contest Type</span>
            </label>
            <select
              {...register("contestType", { required: true })}
              className="select select-bordered w-full bg-gray-800 border-gray-600 text-white"
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
              className="form-control"
            >
              <label className="label">
                <span className="label-text text-white">Entry Fee ($)</span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                placeholder="Entry Fee"
                className="input-gamified"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text text-white">Prize Money ($)</span>
              </label>
              <input
                type="number"
                {...register("prizeMoney", { required: true })}
                placeholder="Prize Money"
                className="input-gamified"
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
              <span className="label-text text-white">Deadline</span>
            </label>
            <input
              type="date"
              {...register("deadline", { required: true })}
              className="input-gamified"
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
