import { useQuery } from "@tanstack/react-query";
import { getAllContestsAdmin } from "../api/contest_api";

const useAdminContests = () => {
    return useQuery({
        queryKey: ["admin-contests"],
        queryFn: getAllContestsAdmin,
    });
};

export default useAdminContests;
