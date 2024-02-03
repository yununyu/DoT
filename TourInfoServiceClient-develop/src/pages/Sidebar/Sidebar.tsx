import {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faAnglesLeft,
    faRoute,
    faMapLocationDot,
    faAnglesRight,
    faUserGear,
    faFaceLaughBeam
} from '@fortawesome/free-solid-svg-icons'
import {Outlet, useNavigate} from 'react-router-dom'
import {SidebarItem} from '../../components'
import {SidebarRoute} from '../../routers'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {getCookie} from '../../util/cookie'
import {useDispatch} from 'react-redux'
import {setUser} from '../../store/slices/LoginSlice'
import {getWithTokenExpire} from '../../util/localStorage'
export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleTrigger = () => setIsOpen(!isOpen)

    const role = useSelector((state: RootState) => state.login.role)
    const dispatch = useDispatch()
    const refreshToken = getCookie('refreshToken')

    const navigate = useNavigate()

    //장소 게시글 페이지로 이동
    function onPlace() {
        navigate('/board/place')
    }

    //코스 게시글 페이지로 이동
    function onCourse() {
        navigate('/board/course')
    }

    //유저 검색 페이지로 이동
    function onFindUser() {
        navigate('/search-user')
    }

    //관리자 페이지로
    function onManager() {
        navigate('/manager')
    }
    useEffect(() => {
        if (getWithTokenExpire('token') === null && !refreshToken) {
            dispatch(setUser({mno: null, role: null}))
        }
    }, [])

    return (
        <div className="z-50 ">
            <div className="h-full ml-auto">
                <div
                    className={` opacity-90 z-50 rounded-tr-3xl  fixed top-0 bg-lightGreen transition-all duration-200 flex-col items-center  ${
                        isOpen ? 'w-64 h-full ' : 'w-10 rounded-br-3xl'
                    }`}>
                    <div
                        className={`bg-darkGreen  flex items-center px-4 text-2xl h-14  ${
                            isOpen
                                ? 'justify-end rounded-tr-2xl'
                                : ' justify-center rounded-r-2xl'
                        }`}>
                        <FontAwesomeIcon
                            className="cursor-pointer"
                            color="white"
                            icon={isOpen ? faAnglesLeft : faAnglesRight}
                            onClick={handleTrigger}
                        />
                    </div>
                    <div
                        className={`flex flex-col justify-between h-5/6 ${
                            isOpen ? 'block' : 'hidden'
                        }`}>
                        <div>
                            <SidebarRoute />
                            {/* 장소 게시판으로 이동  */}
                            <SidebarItem sideTitle="장소 게시판" onClick={onPlace}>
                                <FontAwesomeIcon icon={faMapLocationDot} color="white" />
                            </SidebarItem>
                            {/* 코스 게시판으로 이동 */}
                            <SidebarItem sideTitle="코스 게시판" onClick={onCourse}>
                                <FontAwesomeIcon icon={faRoute} color="white" />
                            </SidebarItem>
                            <SidebarItem sideTitle="유저 검색" onClick={onFindUser}>
                                <FontAwesomeIcon icon={faFaceLaughBeam} color="white" />
                            </SidebarItem>
                            {role === 'ADMIN' && (
                                <SidebarItem
                                    sideTitle="관리자 페이지"
                                    onClick={onManager}>
                                    <FontAwesomeIcon icon={faUserGear} color="white" />
                                </SidebarItem>
                            )}
                        </div>
                        <div className="-mb-10">
                            <p className="text-sm italic font-thin text-stone-100">
                                Discovery of Travel
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    )
}
