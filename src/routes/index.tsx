import {createBrowserRouter, redirect} from "react-router-dom";
import Layout from "../views/Layout";
import Canvas from "../views/canvas/index";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/canvas",
                element: <Canvas/>,
            },
        ],
    },
]);

export default router;