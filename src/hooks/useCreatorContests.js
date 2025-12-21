import { useQuery } from "@tanstack/react-query";
import { getCreatorContests } from "../api/contest_api";

/**
 * Fetch contests created by a specific user.
 * Ensures it always returns an array.
 */
const useCreatorContests = (email) => {
  return useQuery({
    queryKey: ["creator-contests", email],
    queryFn: async () => {
      if (!email) return []; // fallback to empty array if no email
      const data = await getCreatorContests(email);
      // Ensure data is always an array
      return Array.isArray(data) ? data : [];
    },
    enabled: !!email, // only run if email exists
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

export default useCreatorContests;
