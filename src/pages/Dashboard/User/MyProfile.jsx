import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AuthContext from "../../../providers/AuthContext";
import useDbUser from "../../../hooks/useDbUser";
import { updateUser } from "../../../api/user_api";
import {
  getParticipatedContests,
  getWinningContests,
} from "../../../api/contest_api";
import { motion } from "framer-motion";

// 🔥 Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green = win, red = loss

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const { data: dbUser, isLoading } = useDbUser(user?.email);
  const queryClient = useQueryClient();

  // ===== Profile Form =====
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

  const onSubmit = (data) => mutation.mutate(data);

  // ===== Contest Stats =====
  const { data: participated = [] } = useQuery({
    queryKey: ["participated", user?.email],
    queryFn: () => getParticipatedContests(user.email),
    enabled: !!user?.email,
  });

  const { data: won = [] } = useQuery({
    queryKey: ["won", user?.email],
    queryFn: () => getWinningContests(user.email),
    enabled: !!user?.email,
  });

  if (isLoading) return null;

  const total = participated.length;
  const wins = won.length;
  const losses = total - wins;

  const chartData =
    total > 0
      ? [
          { name: "Won", value: wins },
          { name: "Lost", value: losses },
        ]
      : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto space-y-12 p-6"
    >
      {/* ================= PROFILE FORM ================= */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="card-gamified p-8"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          👤 My Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-white text-lg">Name</span>
            </label>
            <input
              className="input-gamified"
              placeholder="Name"
              {...register("name")}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-white text-lg">Image</span>
            </label>
            <input
              className="input-gamified"
              placeholder="Photo URL"
              {...register("photoURL")}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-white text-lg">Bio</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Bio"
              rows={4}
              {...register("bio")}
            />
          </div>

          <motion.button
            className="btn-gamified w-full"
            disabled={mutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mutation.isPending ? "Updating..." : "Update Profile"}
          </motion.button>
        </form>
      </motion.div>

      {/* ================= WIN PERCENTAGE ================= */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card-gamified p-8"
      >
        <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          🏆 Win Percentage
        </h3>

        {total === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-400 text-lg"
          >
            No contest participation yet
          </motion.p>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-6 font-semibold text-xl text-green-400"
            >
              {wins} Wins / {total} Contests (
              {Math.round((wins / total) * 100)}%)
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="w-full h-80"
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyProfile;
