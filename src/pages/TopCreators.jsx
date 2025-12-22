// src/components/TopCreators.jsx
import { useQuery } from "@tanstack/react-query";
import { secureFetch } from "../api/secureFetch";
import Loading from "./Loading";
import { motion } from "framer-motion";

const TopCreators = () => {
  // Fetch creators
  const { data, isLoading, isError } = useQuery({
    queryKey: ["topCreators"],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/top-creators`),
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-center text-red-500">Failed to load top creators</p>;
  if (!data || data.length === 0) return <p className="text-center">No creators found</p>;

  return (
    <div className="px-4 my-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">🌟 Top Creators</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th>Rank</th>
              <th>Creator</th>
              <th>Email</th>
              <th>Contests Created</th>
            </tr>
          </thead>
          <tbody>
            {data.map((creator, index) => (
              <motion.tr
                key={creator.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-100"
              >
                <td>{index + 1}</td>
                <td className="flex items-center gap-2">
                  {creator.photoURL && (
                    <img
                      src={creator.photoURL}
                      alt={creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {creator.name}
                </td>
                <td>{creator.email}</td>
                <td>{creator.count}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCreators;
