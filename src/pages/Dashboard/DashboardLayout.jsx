import { NavLink, Outlet } from "react-router";
import { useContext } from "react";
import AuthContext from "../../providers/AuthContext";

const DashboardLayout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen grid grid-cols-12">

            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-base-200 p-4">
                <h2 className="text-xl font-bold mb-6">Dashboard</h2>

                <ul className="menu space-y-2">
                    {/* USER */}
                    <li>
                        <NavLink to="profile">My Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="participated">My Participated Contests</NavLink>
                    </li>
                    <li>
                        <NavLink to="winning">My Winning Contests</NavLink>
                    </li>

                    <div className="divider"></div>

                    {/* CREATOR (later role guard) */}
                    <li>
                        <NavLink to="add-contest">Add Contest</NavLink>
                    </li>
                    <li>
                        <NavLink to="my-contests">My Created Contests</NavLink>
                    </li>

                    <div className="divider"></div>

                    {/* ADMIN (later role guard) */}
                    <li>
                        <NavLink to="manage-users">Manage Users</NavLink>
                    </li>
                    <li>
                        <NavLink to="manage-contests">Manage Contests</NavLink>
                    </li>
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
