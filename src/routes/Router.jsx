import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../pages/Home";
import AllContest from "../pages/AllContest";
import ExtraSection from "../pages/ExtraSection";
import Login from "../pages/Login";
import Registration from "../pages/Registration";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children:[
        {
            index:true,
            path:'/',
            Component:Home,
        },
        {
          path:'all-contest',
          Component:AllContest,

        },
        {
          path:'extra',
          Component:ExtraSection,

        },
        {
          path:'login',
          Component:Login
        },
        {
          path:'register',
          Component:Registration
        }
    ]
  },
]);