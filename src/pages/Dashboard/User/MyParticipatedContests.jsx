import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../../../providers/AuthContext";
import { secureFetch } from "../../../api/secureFetch";
import Loading from "../../Loading";

const MyParticipatedContests = () => {
  const { user } = useContext(AuthContext);

  const { data: contests = [], isLoading, isError, error } = useQuery({
    queryKey: ["participatedContests", user?.email],
    queryFn: () => secureFetch(`https://contest-hub-server-ashen-two.vercel.app/participated-contests/${user.email}`),
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-500">{error.message}</p>;
  if (!contests.length) return <p>You have not joined any contests yet.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">My Participated Contests</h2>
      {contests.map((contest) => (
        <div key={contest._id} className="p-4 border rounded-lg shadow">
          <h3 className="font-semibold">{contest.title}</h3>
          <p className="text-sm text-gray-500">
            Deadline: {new Date(contest.deadline).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyParticipatedContests;
