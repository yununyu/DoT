import {configureStore} from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import {rootReducer} from './rootReducer'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore'

const useLogger = process.env.NODE_ENV !== 'production'

export const store = () => {
    const middleware: any[] = [thunk]

    if (useLogger) {
        middleware.push(logger)
    }

    const persistConfig = {
        // config 작성
        key: 'root',
        storage,
        whiteList: ['login'] // 적용할 리듀서를 whiteList에 포함시킨다.
    }

    const persistedReducer = persistReducer(persistConfig, rootReducer)

    const store = configureStore({reducer: persistedReducer, middleware})
    const persistor = persistStore(store)
    return {store, persistor}
}
