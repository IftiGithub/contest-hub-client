import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import Loading from "./Loading";
import { getApprovedContests } from "../api/contest_api";

const contestTypes = [
    { key: "design", label: "Design" },
    { key: "writing", label: "Article Writing" },
    { key: "business", label: "Business Idea" },
];

const AllContest = () => {
    const [selectedType, setSelectedType] = useState("all");

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ["approvedContests"],
        queryFn: getApprovedContests,
    });

    if (isLoading) return <Loading />;

    // Filter contests by selected type
    const filteredContests =
        selectedType === "all"
            ? contests
            : contests.filter(
                (c) => c.contestType.toLowerCase() === selectedType.toLowerCase()
            );

    return (
        <div className="px-4 my-16">
            <h1 className="text-4xl font-bold text-center mb-10">
                🎨 All Contests
            </h1>

            {/* ===== Tabs ===== */}
            <div className="flex justify-center gap-4 mb-10 flex-wrap">
                <button
                    className={`btn btn-sm ${selectedType === "all" ? "btn-primary" : "btn-outline"
                        }`}
                    onClick={() => setSelectedType("all")}
                >
                    All
                </button>
                {contestTypes.map((type) => (
                    <button
                        key={type.key}
                        className={`btn btn-sm ${selectedType === type.key ? "btn-primary" : "btn-outline"
                            }`}
                        onClick={() => setSelectedType(type.key)}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* ===== Contest Cards ===== */}
            {filteredContests.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                    No contests available for this category.
                </p>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {filteredContests.map((contest) => (
                        <motion.div
                            key={contest._id}
                            whileHover={{ scale: 1.02 }}
                            className="card bg-base-100 shadow hover:shadow-xl transition"
                        >
                            <img
                                src={contest.image}
                                alt={contest.title}
                                className="h-48 w-full object-cover"
                            />
                            <div className="card-body">
                                <h3 className="card-title">{contest.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {contest.description.slice(0, 80)}...
                                </p>
                                <p className="text-sm">
                                    👥 Participants: {contest.participants.length}
                                </p>
                                <Link
                                    to={`/contest/${contest._id}`}
                                    className="btn btn-primary btn-sm mt-2"
                                >
                                    Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllContest;
