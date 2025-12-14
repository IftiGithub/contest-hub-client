import { useQuery } from "@tanstack/react-query";
import { getParticipatedContests } from "../api/contest_api";

const useParticipatedContests = (email) => {
    return useQuery({
        queryKey: ["participatedContests", email],
        queryFn: () => getParticipatedContests(email),
        enabled: !!email,
    });
};

export default useParticipatedContests;
