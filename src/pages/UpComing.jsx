// src/pages/Upcoming.jsx
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { secureFetch } from "../api/secureFetch";
import Loading from "./Loading";

const Upcoming = () => {
  // Fetch upcoming contests (status = pending approval)
  const { data: upcomingContests = [], isLoading, isError } = useQuery({
    queryKey: ["upcomingContests"],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/upcoming`),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load upcoming contests
      </p>
    );

  return (
    <div className="px-4 my-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">⏳ Upcoming Contests</h2>

      {upcomingContests.length === 0 ? (
        <p className="text-center text-gray-500">Pending contests will shown as upcoming contest.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingContests.map((contest) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              key={contest._id}
              className="card bg-base-100 shadow-lg"
            >
              <img
                src={contest.image}
                alt={contest.title}
                className="h-48 w-full object-cover"
              />
              <div className="card-body">
                <h3 className="card-title">{contest.title}</h3>
                <p className="text-sm text-gray-500">
                  {contest.description?.slice(0, 80)}...
                </p>
                <p className="text-sm">
                  👤 By {contest.creatorName} ({contest.creatorEmail})
                </p>
                <p className="text-sm">
                  ⏳ Deadline: {new Date(contest.deadline).toLocaleDateString()}
                </p>
                <p className="text-lg font-semibold">💰 Prize: ${contest.prizeMoney}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">
                  Pending Approval
                </span>
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

export default Upcoming;
