import {Outlet} from "react-router-dom";

export default function PureLayout() {
    return <div className="flex">
        {/* body */}
        <Outlet/>
    </div>
}