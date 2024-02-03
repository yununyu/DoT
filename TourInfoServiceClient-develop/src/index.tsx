import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import '@fontsource/material-icons'
//MDB5 CSS 추가
import '@fortawesome/fontawesome-free/css/all.min.css'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from './store'
import {CookiesProvider} from 'react-cookie'
import {PersistGate} from 'redux-persist/integration/react'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <CookiesProvider>
        <Provider store={store().store}>
            <PersistGate loading={null} persistor={store().persistor}>
                <DndProvider backend={HTML5Backend}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </DndProvider>
            </PersistGate>
        </Provider>
    </CookiesProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
