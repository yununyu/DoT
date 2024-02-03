import {Navigate, Outlet} from 'react-router-dom'
import {getCookie} from '../util/cookie'

export const AuthRoute = () => {
    const refreshToken = getCookie('refreshToken')
    return refreshToken ? <Navigate to={'/'} /> : <Outlet />
}
