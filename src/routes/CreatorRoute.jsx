import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import AuthContext from "../providers/AuthContext";
import useDbUser from "../hooks/useDbUser";
import Loading from "../pages/Loading";

const CreatorRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const { data: dbUser, isLoading } = useDbUser(user?.email);

    if (loading || isLoading) {
        return <Loading />;
    }

    if (!user || dbUser?.role !== "creator") {
        return (
            <Navigate
                to="/"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default CreatorRoute;
