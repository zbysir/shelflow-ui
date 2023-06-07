import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ReactFlowContext} from './store/context/ReactFlowContext'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ReactFlowContext>
        <App/>
    </ReactFlowContext>
)
