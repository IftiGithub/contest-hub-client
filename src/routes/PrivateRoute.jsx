import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import AuthContext from "../providers/AuthContext";
import Loading from "../pages/Loading";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default PrivateRoute;
