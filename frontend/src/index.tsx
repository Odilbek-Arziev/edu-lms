import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "./store";
import {ModalProvider} from "./Components/Common/Modal";
import "@fortawesome/fontawesome-free/css/all.css";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <React.Fragment>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <ModalProvider>
                    <App/>
                </ModalProvider>
            </BrowserRouter>
        </React.Fragment>
    </Provider>
);

reportWebVitals();