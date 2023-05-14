import './App.css'
import {RouterProvider, useLocation} from "react-router";
import {Flipped, Flipper} from "react-flip-toolkit";
import {createBrowserRouter, Link, Outlet} from "react-router-dom";
import {useState} from "react";

function Layout() {
    // let params = useParams();
    const location = useLocation();
    const [fullScreen, setFullScreen] = useState(false)
    console.log('location', location)
    return <div>

        <h1>h1
            <Link to={"/about"}> about </Link>
            <Link to={{pathname:"/job"}}> job </Link>
            <Link to={"/"}> / </Link>
        </h1>
        <Flipper flipKey={location.pathname}>
            <Outlet/>
        </Flipper>

        <Flipper flipKey={fullScreen}>
            <Flipped flipId="square233">
                <div
                    className={fullScreen ? 'full-screen-square' : 'square'}
                    onClick={() => setFullScreen(!fullScreen)}
                />
            </Flipped>
        </Flipper>

    </div>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        // loader: rootLoader,
        children: [
            {
                path: "team",
                element: <h1 className={"h-10 bg-slate-400 square"}>team</h1>,
                // loader: teamLoader,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App
