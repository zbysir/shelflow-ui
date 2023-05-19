import {useLocation} from "react-router";
import {Outlet} from "react-router-dom";

export default function Layout() {
    const location = useLocation();
    console.log('location', location)
    return <Outlet/>
}