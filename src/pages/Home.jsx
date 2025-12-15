import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { Link } from "react-router"; // Make sure to import from react-router-dom
import { getPopularContests } from "../api/contest_api";

const Home = () => {
    const {
        data: popularContests = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["popularContests"],
        queryFn: getPopularContests,
    });

    if (isLoading) return <Loading />;
    if (isError)
        return <p className="text-center text-red-500">Failed to load contests</p>;

    return (
        <div className="px-4">
            {/* 🔥 Banner Section */}
            <section className="my-10 text-center">
                <h1 className="text-4xl font-bold mb-3">
                    Discover Creative Contests
                </h1>
                <p className="text-gray-500">
                    Participate, compete, and win exciting prizes!
                </p>
            </section>

            {/* 🔥 Popular Contests */}
            <section className="my-10">
                <h2 className="text-2xl font-bold mb-6">🔥 Popular Contests</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {popularContests.map((contest) => (
                        <div
                            key={contest._id}
                            className="card bg-base-100 shadow-md"
                        >
                            <figure>
                                <img
                                    src={contest.image}
                                    alt={contest.title}
                                    className="h-48 w-full object-cover"
                                />
                            </figure>

                            <div className="card-body">
                                <h3 className="card-title">{contest.title}</h3>

                                <p className="text-sm text-gray-500">
                                    {contest.description.slice(0, 80)}...
                                </p>

                                <p className="text-sm">
                                    👥 Participants: {contest.participants.length}
                                </p>

                                <div className="card-actions justify-end">
                                    <Link
                                        to={`/contest/${contest._id}`} // Pass contest ID
                                        className="btn btn-primary btn-sm"
                                    >
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show All Button */}
                <div className="text-center mt-8">
                    <Link to="/all-contests" className="btn btn-outline">
                        Show All
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
