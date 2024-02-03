import {useState} from 'react'
import {Title, Subtitle, DropdownSelect, Button, LoginInput} from '../../components'
import {FindEmailRequest} from '../../api/Find/Find'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export const FindEmail = () => {
    const navigate = useNavigate()
    const [userName, setUserName] = useState<string>('')
    const [userPhoneNumber, setUserPhoneNumber] = useState<string>('')
    // 전화번호 검증
    var phone_regex = /^010-([0-9]{3,4})-([0-9]{4})$/

    // 이름 state 변경
    function onUserNameChange(value: string) {
        setUserName(value)
    }

    // 휴대폰번호 state 변경
    function onUserPhoneNumberChange(value: string) {
        setUserPhoneNumber(value)
    }

    // 이메일 찾기 버튼 클릭시 이벤트
    async function onEmailFindClicked(
        e?: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) {
        //키보드로 입력이 들어왔는데 Enter가 아닌경우 return
        if (
            e?.type === 'keydown' &&
            (e as React.KeyboardEvent<HTMLInputElement>).key !== 'Enter'
        ) {
            return
        }

        if (userName === '') {
            alert('이름을 입력하세요')
            return
        }
        if (userPhoneNumber === '') {
            alert('휴대폰 번호를 입력하세요')
            return
        }
        if (!phone_regex.test(userPhoneNumber)) {
            alert('올바른 전화번호 형식이 아닙니다')
            return
        }

        try {
            console.log('userName : ', userName, 'userPhoneNumber : ', userPhoneNumber)
            const data = await FindEmailRequest(userName, userPhoneNumber)
            if (data.email) {
                alert('가입한 이메일 : ' + data.email)
                navigate('/login')
            } else {
                alert('일치하는 회원정보가 없습니다')
            }
        } catch (error) {
            alert('요청 실패')
            console.log(error)
        }
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col justify-around w-2/3 p-8 h-96">
                <Title className="my-6 text-[#609966]">계정 찾기</Title>

                {/* 이름 입력창 */}
                <div onKeyDown={onEmailFindClicked}>
                    <LoginInput
                        className="mb-6"
                        value={userName}
                        text="이름"
                        onChange={onUserNameChange}
                    />
                    {/* 휴대폰번호 입력창 */}
                    <LoginInput
                        className="mb-3"
                        value={userPhoneNumber}
                        text="전화번호(- 포함)"
                        onChange={onUserPhoneNumberChange}
                    />
                </div>
                <Button
                    value="이메일 찾기"
                    onClick={onEmailFindClicked}
                    className="bg-[#8EB682] hover:bg-[#609966] text-white"></Button>
            </div>
        </div>
    )
}
