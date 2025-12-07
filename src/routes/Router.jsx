import { createBrowserRouter } from "react-router";
import Root from "../Root/Root";
import Home from "../pages/Home";
import AllContest from "../pages/AllContest";
import ExtraSection from "../pages/ExtraSection";

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
          
        }
    ]
  },
]);