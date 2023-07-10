import './App.css'
import {RouterProvider} from "react-router";
import router from './routes/index.tsx'
import { Toaster } from "@/components/ui/toaster"


function App() {
    return <div>
        <RouterProvider router={router}/>
        <Toaster />
    </div>
}

export default App
