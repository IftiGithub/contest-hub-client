import { NavLink, Outlet } from "react-router";
import { useContext } from "react";
import AuthContext from "../../providers/AuthContext";
import useDbUser from "../../hooks/useDbUser";
import Loading from "../Loading.jsx"

const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const { data: dbUser, isLoading } = useDbUser(user?.email);

    const role = dbUser?.role;

    // 🔐 IMPORTANT
    if (loading || isLoading) {
        return <Loading></Loading>
    }

    return (
        <div className="min-h-screen grid grid-cols-12">

            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-base-200 p-4">
                <h2 className="text-xl font-bold mb-2">Dashboard</h2>

                {/* TEMP: debug info (remove later) */}
                <p className="text-xs text-gray-500">{dbUser?.email}</p>
                <p className="text-xs font-semibold capitalize mb-4">
                    Role: {dbUser?.role}
                </p>

                <ul className="menu space-y-2">

                    {/* ===== USER ===== */}
                    <li>
                        <NavLink to="profile">My Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="participated">My Participated Contests</NavLink>
                    </li>
                    <li>
                        <NavLink to="winning">My Winning Contests</NavLink>
                    </li>

                    {/* ===== CREATOR ===== */}
                    {role === "creator" && (
                        <>
                            <div className="divider"></div>
                            <li>
                                <NavLink to="add-contest">Add Contest</NavLink>
                            </li>
                            <li>
                                <NavLink to="my-contests">My Created Contests</NavLink>
                            </li>
                        </>
                    )}

                    {/* ===== ADMIN ===== */}
                    {role === "admin" && (
                        <>
                            <div className="divider"></div>
                            <li>
                                <NavLink to="manage-users">Manage Users</NavLink>
                            </li>
                            <li>
                                <NavLink to="manage-contests">Manage Contests</NavLink>
                            </li>
                        </>
                    )}

                </ul>

            </aside>

            {/* Main Content */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
                <Outlet />
            </main>

        </div>
    );
};

export default DashboardLayout;
