import {createBrowserRouter} from "react-router-dom";
import Layout from "../views/Layout";
import Canvas from "../views/canvas/index";
import Flows from '../views/flow/index'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Flows/>,
            },
            {
                path: "/canvas",
                element: <Canvas/>,
            },
            {
                path: '/canvas/:id',
                element: <Canvas/>
            },
        ],
    },
]);

export default router;