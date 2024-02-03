import {Navigate, Outlet} from 'react-router-dom'
import {getCookie} from '../util/cookie'
import {useSelector} from 'react-redux'
import {RootState} from '../store/rootReducer'

export const ManagerRoute = () => {
    const role = useSelector((state: RootState) => state.login.role)
    return role === 'ADMIN' ? <Outlet /> : <Navigate to={'/'} />
}
