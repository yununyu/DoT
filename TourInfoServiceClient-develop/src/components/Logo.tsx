import {Title} from './Texts'
import mainLogo from '../assets/mainLogo.png'
import {useNavigate} from 'react-router-dom'

export const Logo = ({}) => {
    const navigate = useNavigate()
    //메인 페이지로 이동
    function onMain() {
        navigate('/')
    }
    return (
        <div className="flex justify-center">
            <Title
                onClick={onMain}
                className="flex justify-center mt-8 -mb-4 cursor-pointer">
                <img src={mainLogo} className="w-36 sm:w-36 md:w-44 lg:w-44" />
            </Title>
        </div>
    )
}
