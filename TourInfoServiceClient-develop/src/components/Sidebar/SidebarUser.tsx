import {FC, PropsWithChildren, useEffect, useState} from 'react'
import UserImage from '../../assets/profileImage.jpeg'
import {LoadingSppinner, Subtitle} from '../index'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {logoutRequest} from '../../api'
import Cookies from 'js-cookie'
import {setRole, setUser} from '../../store/slices/LoginSlice'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {getUserInfo} from '../../api/Member/Member'

type SidebarUserProps = {}

export const SidebarUser: FC<PropsWithChildren<SidebarUserProps>> = ({children}) => {
    const [loading, setLoading] = useState(false)
    const mno = useSelector((state: RootState) => state.login.mno)

    const [userName, setUserName] = useState<string>('')
    const [imgSrc, setImgSrc] = useState<string>('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    //마이페이지로 이동
    function onMypage() {
        navigate(`/mypage/${mno}`)
    }

    //회원 정보 들고오기
    async function onUserInfo() {
        try {
            const data = mno && (await getUserInfo(mno))
            if (data) {
                dispatch(setRole(data.role))
                setUserName(data.name)
                setImgSrc(data.image)
            }
        } catch (e) {
            console.log(e)
        }
    }

    //로그아웃
    async function onLogout() {
        setLoading(true)
        try {
            await logoutRequest()
            setLoading(false)
        } catch (e) {
            setLoading(false)
            return e
        }
        localStorage.removeItem('token')
        Cookies.remove('refreshToken')
        dispatch(setUser({mno: null, role: null}))
        navigate('/login')
        setLoading(false)
    }

    useEffect(() => {
        onUserInfo()
    }, [])

    return (
        <div className="flex items-center justify-center w-full px-4 ">
            {loading && <LoadingSppinner />}
            {children}
            <div className="flex flex-col items-center w-full h-full ">
                <div className="flex justify-center overflow-hidden w-28 h-28">
                    <img
                        onClick={onMypage}
                        src={imgSrc ? imgSrc : UserImage}
                        className="w-full h-full rounded-full cursor-pointer"
                    />
                </div>
                <Subtitle className="my-4 font-light text-center text-white">
                    {userName}
                </Subtitle>
                <div
                    className="flex items-center my-2 mr-3 cursor-pointer"
                    onClick={onLogout}>
                    <FontAwesomeIcon size="sm" icon={faRightFromBracket} color="white" />
                    <p className="ml-2 text-sm text-white">Logout</p>
                </div>
            </div>
        </div>
    )
}
