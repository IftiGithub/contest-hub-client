import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { color, motion } from "framer-motion";
import AuthContext from "../../providers/AuthContext";
import useDbUser from "../../hooks/useDbUser";
import Loading from "../Loading";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    getParticipatedContests,
    getWinningContests,
    getCreatorContests,
    getApprovedContests,
} from "../../api/contest_api";
import { getAllUsers } from "../../api/user_api";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

// Updated StatCard with better text handling
const StatCard = ({ icon, label, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`p-6 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
        style={{ backgroundColor: "var(--bg-secondary)" }}
    >
        <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <p className="text-sm opacity-80 mb-1" style={{ color: "var(--text-secondary)" }}>
                    {label}
                </p>
                <p className="text-3xl font-bold mt-2 truncate" style={{ color: "var(--text-primary)" }}>
                    {value}
                </p>
            </div>
            <div className="text-4xl flex-shrink-0 ml-4">{icon}</div>
        </div>
    </motion.div>
);

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 rounded-lg shadow-lg border" style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-light)",
                color: "var(--text-primary)"
            }}>
                <p className="font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const { data: dbUser, isLoading: dbUserLoading } = useDbUser(user?.email);

    // User Dashboard Data
    const { data: participated = [], isLoading: participatedLoading } = useQuery({
        queryKey: ["participated", user?.email],
        queryFn: () => getParticipatedContests(user.email),
        enabled: !!user?.email && dbUser?.role === "user",
    });

    const { data: won = [], isLoading: wonLoading } = useQuery({
        queryKey: ["won", user?.email],
        queryFn: () => getWinningContests(user.email),
        enabled: !!user?.email && dbUser?.role === "user",
    });

    // Creator Dashboard Data
    const { data: createdContests = [], isLoading: createdLoading } = useQuery({
        queryKey: ["creator-contests", user?.email],
        queryFn: () => getCreatorContests(user.email),
        enabled: !!user?.email && dbUser?.role === "creator",
    });

    // Admin Dashboard Data
    const { data: allContests = [], isLoading: contestsLoading } = useQuery({
        queryKey: ["all-contests-admin"],
        queryFn: getApprovedContests,
        enabled: dbUser?.role === "admin",
    });

    const { data: allUsers = [], isLoading: usersLoading } = useQuery({
        queryKey: ["all-users-admin"],
        queryFn: getAllUsers,
        enabled: dbUser?.role === "admin",
    });

    if (dbUserLoading) return <Loading />;

    const role = dbUser?.role || "user";
    const isLoading = participatedLoading || wonLoading || createdLoading || contestsLoading || usersLoading;

    // ==================== USER DASHBOARD ====================
    if (role === "user") {
        const losses = participated.length - won.length;
        const winPercentage =
            participated.length > 0
                ? Math.round((won.length / participated.length) * 100)
                : 0;

        const chartData = [
            { name: "Won", value: won.length },
            { name: "Lost", value: losses },
        ];

        const barChartData = [
            { name: "Participated", count: participated.length },
            { name: "Won", count: won.length },
            { name: "Lost", count: losses },
        ];

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="p-4 md:p-6 space-y-6 md:space-y-8"
            >
                <div className="flex gap-1">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"                    >
                        Welcome, {user.displayName || "User"}!
                    </motion.h1>
                    <div className="text-4xl">👋</div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    <StatCard
                        icon="🎯"
                        label="Total Contests"
                        value={participated.length}
                    />
                    <StatCard
                        icon="🏆"
                        label="Contests Won"
                        value={won.length}
                    />
                    <StatCard
                        icon="⚔️"
                        label="Contests Lost"
                        value={losses}
                    />
                    <StatCard
                        icon="📊"
                        label="Win Rate"
                        value={`${winPercentage}%`}
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Win/Loss Distribution
                        </h3>
                        {participated.length > 0 ? (
                            <div className="w-full h-[280px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[280px] md:h-[300px] flex items-center justify-center">
                                <p style={{ color: "var(--text-secondary)" }}>No contest data yet</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Contest Statistics
                        </h3>
                        {participated.length > 0 ? (
                            <div className="w-full h-[280px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-medium)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: "var(--text-secondary)" }}
                                        />
                                        <YAxis
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: "var(--text-secondary)" }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[280px] md:h-[300px] flex items-center justify-center">
                                <p style={{ color: "var(--text-secondary)" }}>No contest data yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    // ==================== CREATOR DASHBOARD ====================
    if (role === "creator") {
        const approved = createdContests.filter(
            (c) => c.status === "approved"
        ).length;
        const pending = createdContests.filter(
            (c) => c.status === "pending"
        ).length;
        const rejected = createdContests.filter(
            (c) => c.status === "rejected"
        ).length;

        const statusChartData = [
            { name: "Approved", value: approved },
            { name: "Pending", value: pending },
            { name: "Rejected", value: rejected },
        ];

        const totalParticipants = createdContests.reduce(
            (sum, c) => sum + (c.participants?.length || 0),
            0
        );

        // Contest trend data
        const contestTrendData = createdContests.slice(-5).map(contest => ({
            name: contest.title?.substring(0, 10) + (contest.title?.length > 10 ? "..." : ""),
            participants: contest.participants?.length || 0,
        }));

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="p-4 md:p-6 space-y-6 md:space-y-8"
            >
                <div className="flex gap-1">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"                >
                        Creator Dashboard
                    </motion.h1>
                    <div className=" text-4xl">🎨</div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    <StatCard
                        icon="📋"
                        label="Total Contests"
                        value={createdContests.length}
                    />
                    <StatCard
                        icon="✅"
                        label="Approved"
                        value={approved}
                    />
                    <StatCard
                        icon="⏳"
                        label="Pending"
                        value={pending}
                    />
                    <StatCard
                        icon="👥"
                        label="Total Participants"
                        value={totalParticipants}
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Status Distribution */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Contest Status Distribution
                        </h3>
                        {createdContests.length > 0 ? (
                            <div className="w-full h-[280px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#f59e0b" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[280px] md:h-[300px] flex items-center justify-center">
                                <p style={{ color: "var(--text-secondary)" }}>No contests created yet</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Contest Overview Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Contest Overview
                        </h3>
                        {createdContests.length > 0 ? (
                            <div className="w-full h-[280px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statusChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-medium)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: "var(--text-secondary)" }}
                                        />
                                        <YAxis
                                            stroke="var(--text-secondary)"
                                            tick={{ fill: "var(--text-secondary)" }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[280px] md:h-[300px] flex items-center justify-center">
                                <p style={{ color: "var(--text-secondary)" }}>No contests created yet</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Recent Contest Trends - Optional */}
                {contestTrendData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Recent Contest Trends
                        </h3>
                        <div className="w-full h-[280px] md:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={contestTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-medium)" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--text-secondary)"
                                        tick={{ fill: "var(--text-secondary)" }}
                                    />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        tick={{ fill: "var(--text-secondary)" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="participants"
                                        stroke="#8ab4f8"
                                        strokeWidth={2}
                                        dot={{ fill: "#8ab4f8" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    // ==================== ADMIN DASHBOARD ====================
    if (role === "admin") {
        const approvedContests = allContests.filter(
            (c) => c.status === "approved"
        ).length;
        const pendingContests = allContests.filter(
            (c) => c.status === "pending"
        ).length;
        const rejectedContests = allContests.filter(
            (c) => c.status === "rejected"
        ).length;

        const adminChartData = [
            { name: "Approved", value: approvedContests },
            { name: "Pending", value: pendingContests },
            { name: "Rejected", value: rejectedContests },
        ];

        const userStats = [
            { name: "Users", value: allUsers.length },
            { name: "Contests", value: allContests.length },
            { name: "Pending", value: pendingContests },
            { name: "Approved", value: approvedContests },
        ];

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="p-4 md:p-6 space-y-6 md:space-y-8"
            >
                <div className="flex gap-1">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"        >
                        Admin Dashboard
                    </motion.h1>
                    <div className=" text-4xl">⚙️</div>
                </div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    <StatCard
                        icon="👥"
                        label="Total Users"
                        value={allUsers.length}
                    />
                    <StatCard
                        icon="📋"
                        label="Total Contests"
                        value={allContests.length}
                    />
                    <StatCard
                        icon="⏳"
                        label="Pending Approval"
                        value={pendingContests}
                    />
                    <StatCard
                        icon="✅"
                        label="Approved"
                        value={approvedContests}
                    />
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Contest Status Pie Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Contest Status Breakdown
                        </h3>
                        {allContests.length > 0 ? (
                            <div className="w-full h-[280px] md:h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={adminChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value, percent }) =>
                                                `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#22c55e" />
                                            <Cell fill="#f59e0b" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[280px] md:h-[300px] flex items-center justify-center">
                                <p style={{ color: "var(--text-secondary)" }}>No contest data available</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Platform Overview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card-gamified p-4 md:p-6"
                    >
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{ color: "var(--text-primary)" }}>
                            Platform Overview
                        </h3>
                        <div className="w-full h-[280px] md:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-medium)" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--text-secondary)"
                                        tick={{ fill: "var(--text-secondary)" }}
                                    />
                                    <YAxis
                                        stroke="var(--text-secondary)"
                                        tick={{ fill: "var(--text-secondary)" }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        );
    }

    return null;
};

export default DashboardHome;