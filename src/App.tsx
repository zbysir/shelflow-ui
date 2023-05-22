import './App.css'
import {RouterProvider} from "react-router";

import router from './routes/index.tsx'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme/index.ts'


function App() {
    return <ThemeProvider theme={theme}><RouterProvider router={router}/></ThemeProvider>
}

export default App
