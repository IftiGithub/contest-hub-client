import { useQuery } from "@tanstack/react-query";
import { getUserByEmail } from "../api/user_api";

const useDbUser = (email) => {
    return useQuery({
        queryKey: ["user", email],
        queryFn: () => getUserByEmail(email),
        enabled: !!email, // only run if email exists
    });
};

export default useDbUser;
