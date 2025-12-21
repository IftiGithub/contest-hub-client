import { useQuery } from "@tanstack/react-query";
import { getAllContestsAdmin } from "../api/contest_api";

const useAdminContests = () => {
  return useQuery({
    queryKey: ["admin-contests"],
    queryFn: async () => {
      const data = await getAllContestsAdmin();
      return data;
    },
  });
};

export default useAdminContests;
