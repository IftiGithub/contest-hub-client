import { useQuery } from "@tanstack/react-query";
import { secureFetch } from "../api/secureFetch";

/**
 * Fetch the user data from backend by email
 * Ensures it always returns an object with at least { role: 'user' }
 */
const useDbUser = (email) => {
  return useQuery({
    queryKey: ["user", email],
    queryFn: async () => {
      if (!email) return { role: "user" }; // fallback
      const data = await secureFetch(`http://localhost:3000/users/${email}`);
      // Ensure data is always an object
      return data || { role: "user" };
    },
    enabled: !!email, // only run if email exists
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
};

export default useDbUser;
