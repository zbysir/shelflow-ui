import './App.css'
import {RouterProvider} from "react-router";
import router from './routes/index.tsx'


function App() {
    return <RouterProvider router={router}/>
}

export default App
