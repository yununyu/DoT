import {faRightToBracket} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useNavigate} from 'react-router-dom'

export const SidebarLogin = ({}) => {
    const navigate = useNavigate()

    //로그인
    function onLogIn() {
        navigate('/login')
    }
    return (
        <>
            <p className="text-white">로그인을 해주세요</p>
            <div
                className="flex items-center justify-center my-2 mr-3 cursor-pointer hover:font-bold hover:-translate-y-0.5 duration-100"
                onClick={onLogIn}>
                <FontAwesomeIcon icon={faRightToBracket} color="white" />
                <p className="ml-2 text-sm text-white">Log In</p>
            </div>
        </>
    )
}
