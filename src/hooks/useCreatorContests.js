import { useQuery } from "@tanstack/react-query";
import { getCreatorContests } from "../api/contest_api";

const useCreatorContests = (email) => {
  return useQuery({
    queryKey: ["creator-contests", email],
    queryFn: () => getCreatorContests(email),
    enabled: !!email,
  });
};

export default useCreatorContests;
