import { useQuery } from "@tanstack/react-query";
import { getWinningContests } from "../api/contest_api";

const useWinningContests = (email) => {
    return useQuery({
        queryKey: ["winningContests", email],
        queryFn: () => getWinningContests(email),
        enabled: !!email,
    });
};

export default useWinningContests;
