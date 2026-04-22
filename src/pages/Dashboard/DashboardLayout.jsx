import { Link, NavLink, Outlet } from "react-router";
import { useContext } from "react";
import AuthContext from "../../providers/AuthContext";
import useDbUser from "../../hooks/useDbUser";
import Loading from "../Loading.jsx";
import { motion } from "framer-motion";

const DashboardLayout = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  // Only fetch dbUser when user exists
  const { data: dbUser, isLoading: dbUserLoading } = useDbUser(user?.email);

  // Wait until both Firebase user and dbUser are loaded
  if (authLoading || dbUserLoading) return <Loading />;

  // Fallback role
  const role = dbUser?.role || "user";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-black text-white grid grid-cols-12"
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="col-span-12 md:col-span-3 lg:col-span-2 bg-gray-900 p-6 border-r border-gray-700"
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/dashboard" className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          >Dashboard</Link>
        </motion.h2>

        {/* Debug info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-6 p-3 bg-gray-800 rounded-lg"
        >
          <p className="text-xs text-gray-400">{dbUser?.email || user?.email}</p>
          <p className="text-xs font-semibold capitalize text-green-400">
            Role: {role}
          </p>
        </motion.div>

        <ul className="menu space-y-2">
          {/* ===== USER ===== */}
          <motion.li
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              🏠 Home
            </NavLink>
          </motion.li>
          <motion.li
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              👤 My Profile
            </NavLink>
          </motion.li>
          <motion.li
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <NavLink
              to="participated"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              🎯 My Participated Contests
            </NavLink>
          </motion.li>
          <motion.li
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <NavLink
              to="winning"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition-colors ${isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              🏆 My Winning Contests
            </NavLink>
          </motion.li>

          {/* ===== CREATOR ===== */}
          {role === "creator" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="divider border-gray-600 my-4"
              ></motion.div>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <NavLink
                  to="add-contest"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                >
                  ➕ Add Contest
                </NavLink>
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <NavLink
                  to="my-contests"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                >
                  📋 My Created Contests
                </NavLink>
              </motion.li>
            </>
          )}

          {/* ===== ADMIN ===== */}
          {role === "admin" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="divider border-gray-600 my-4"
              ></motion.div>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                <NavLink
                  to="manage-users"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                >
                  👥 Manage Users
                </NavLink>
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.7 }}
              >
                <NavLink
                  to="manage-contests"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors ${isActive
                      ? "bg-red-600 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                    }`
                  }
                >
                  ⚙️ Manage Contests
                </NavLink>
              </motion.li>
            </>
          )}
        </ul>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="col-span-12 md:col-span-9 lg:col-span-10 p-6 bg-gray-800"
      >
        <Outlet />
      </motion.main>
    </motion.div>
  );
};

export default DashboardLayout;
