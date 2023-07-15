import {createBrowserRouter} from "react-router-dom";
import Canvas from "../views/canvas/index";
import Flows from '../views/flow/index'
import MainLayout from "@/views/layout/main.tsx";
import Component from "@/routes/component.tsx";
// import {BASE_URL} from '../utils/const'
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                path: "/",
                element: <Flows/>,
            },
        ],
    },
    {
        path: "/canvas",
        element: <Canvas/>,
    },
    {
        path: '/canvas/:id',
        element: <Canvas/>
    },
    {
        path:'/component',
        element:<Component/>
    }
], {
    basename: import.meta.env.BASE_URL
});

export default router;