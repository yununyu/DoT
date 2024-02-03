import {FC} from 'react'
import {Title} from '../components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelopeOpenText} from '@fortawesome/free-solid-svg-icons'
import noImage from '../assets/smallLogo.png'
import {mailResendRequest} from '../api/MailResend/MailResend'

type MailResendProps = {
    email: string
    onClick: () => void
}

export const MailResend: FC<MailResendProps> = ({...props}) => {
    function send() {
        try {
            const data = mailResendRequest(props.email)
        } catch (err) {
            alert('mail 전송 오류')
        }
        props.onClick()
        alert('메일 전송!')
    }
    return (
        <div className="absolute modal-box h-1/3">
            <form method="dialog">
                <button
                    className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
                    onClick={props.onClick}>
                    ✕
                </button>
            </form>
            <div className="flex">
                <img className="h-32 -mx-10 -my-12" src={noImage} alt="DoT 여행의 발견" />
                <Title>Email 인증이 필요합니다</Title>
            </div>
            <div className="my-4">
                <p className="pt-4">회원 가입시 입력한 Email로 인증을 진행해 주세요</p>
                <p className="pb-4">
                    인증 Mail이 안오셨거나, 재전송이 필요하면 아래의 버튼을 눌러주세요
                </p>
                <div
                    className="flex mt-2 border rounded-lg hover:cursor-pointer hover:border-gray-400"
                    onClick={send}>
                    <FontAwesomeIcon
                        className="mx-2 my-2 border-b-2 h-11"
                        icon={faEnvelopeOpenText}
                    />
                    <div className="flex-row items-center justify-center mx-auto my-auto">
                        <p>Email Address</p>
                        <p>{props.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
