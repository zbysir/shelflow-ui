import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ReactFlowContext} from './store/context/ReactFlowContext'
import {SnackbarProvider} from 'notistack'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <SnackbarProvider>
        <ReactFlowContext>
            <App/>
        </ReactFlowContext>
    </SnackbarProvider>
)
