import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../pages/Home";
import AllContest from "../pages/AllContest";
import ExtraSection from "../pages/ExtraSection";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import ManageContests from "../pages/Dashboard/Admin/ManageContests";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import MyCreatedContests from "../pages/Dashboard/Creator/MyCreatedContests";
import AddContest from "../pages/Dashboard/Creator/AddContest";
import MyWinningContests from "../pages/Dashboard/User/MyWinningContests";
import MyParticipatedContests from "../pages/Dashboard/User/MyParticipatedContests";
import MyProfile from "../pages/Dashboard/User/MyProfile";
import ContestDetails from "../pages/ContestDetails";
import CreatorRoute from "./CreatorRoute";
import AdminRoute from "./AdminRoute";
import EditContest from "../pages/Dashboard/Creator/EditContest";
import PaymentSuccess from "../pages/PaymentSuccess ";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,      // Home page
        Component: Home,
      },
      {
        path: "all-contest",
        Component: AllContest,
      },
      {
        path: "extra",
        Component: ExtraSection,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Registration,
      },
      {
        path: "contest/:id",   // Contest details route
        element: (
          <PrivateRoute>
            <ContestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      }
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <MyProfile /> },
      { path: "participated", element: <MyParticipatedContests /> },
      { path: "winning", element: <MyWinningContests /> },

      // CREATOR
      {
        path: "add-contest",
        element: (
          <CreatorRoute>
            <AddContest />
          </CreatorRoute>
        ),
      },
      {
        path: "my-contests",
        element: (
          <CreatorRoute>
            <MyCreatedContests />
          </CreatorRoute>
        ),
      },
      {
        path: "edit-contest/:id",
        element: (
          <CreatorRoute>
            <EditContest></EditContest>
          </CreatorRoute>
        ),
      },

      // ADMIN
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-contests",
        element: (
          <AdminRoute>
            <ManageContests />
          </AdminRoute>
        ),
      },
    ],
  }
]);
