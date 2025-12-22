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
    <div className="max-w-3xl space-y-12">
      {/* ================= PROFILE FORM ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="text-lg">Name</label>
          <input
            className="input input-bordered w-full"
            placeholder="Name"
            {...register("name")}
          />

          <label className="text-lg">Image</label>
          <input
            className="input input-bordered w-full"
            placeholder="Photo URL"
            {...register("photoURL")}
          />

          <label className="text-lg">Bio</label>
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Bio"
            {...register("bio")}
          />

          <button className="btn btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      {/* ================= WIN PERCENTAGE ================= */}
      <div className="bg-base-200 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4 text-center">
          🏆 Win Percentage
        </h3>

        {total === 0 ? (
          <p className="text-center text-gray-500">
            No contest participation yet
          </p>
        ) : (
          <>
            <p className="text-center mb-4 font-semibold">
              {wins} Wins / {total} Contests (
              {Math.round((wins / total) * 100)}%)
            </p>

            <div className="w-full h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
