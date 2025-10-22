import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/main/index.css'
import App from './components/main/App.tsx'
import {BrowserRouter} from "react-router-dom";
import store from "./redux/store.ts";
import {Provider} from "react-redux";

createRoot(document.getElementById('root')!).render(



    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
)
