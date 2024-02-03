import {FC} from 'react'
import {SidebarUser} from '../components'
import {getWithTokenExpire} from '../util/localStorage'
import {getCookie} from '../util/cookie'
import {SidebarLogin} from '../components/Sidebar/SidebarLogin'

type SidebarRouteProps = {}

export const SidebarRoute: FC<SidebarRouteProps> = () => {
    const user = getWithTokenExpire('token')
    const refreshToken = getCookie('refreshToken')

    return (
        <div className="py-5 mb-10 bg-darkGreen rounded-b-3xl">
            {refreshToken || user !== null ? <SidebarUser /> : <SidebarLogin />}
        </div>
    )
}
