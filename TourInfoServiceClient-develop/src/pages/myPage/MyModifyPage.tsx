import {user} from './../../data/User/User'
import {useState, useEffect, useRef, ChangeEvent} from 'react'
import {ShowUserInfo, onChangeUserData, deleteId} from './../../api/MyPage/ShowUserInfo'
import {Button} from './../../components/Button'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {LoginInput, Title} from './../../components/index'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import common from '../../assets/profileImage.jpeg'
import Cookie from 'js-cookie'
import {useDispatch} from 'react-redux'
import {setUser} from '../../store/slices/LoginSlice'

//TODO 수정하기 버튼 클릭 시 다시 마이페이지로 이동, margin/padding 조정, 이미지 업로드 수정

export const MyModifyPage = () => {
    const [userData, setUserData] = useState<user | null>(null)
    const [userName, setUserName] = useState<string>(userData ? userData.name : '')
    const [userPhone, setUserPhone] = useState<string>(userData ? userData.phone : '')
    const [profileImage, setProfileImage] = useState<string>(
        userData ? userData.image : ''
    )
    const [file, setFile] = useState<File | null>(null)
    const fileInput = useRef<HTMLInputElement | null>(null)

    const dispatch = useDispatch()

    const userMno = useSelector((state: RootState) => state.login.mno) || 0

    const navigate = useNavigate()

    const onChangeUserName = (e: string) => {
        setUserName(e)
    }

    const onChangeUserPhone = (e: string) => {
        setUserPhone(e)
    }

    const onChangeUserImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const reader = new FileReader()
            setFile(e.target.files[0])

            reader.onload = () => {
                if (reader.readyState === 2) {
                    const result = reader.result

                    if (typeof result === 'string') {
                        setProfileImage(result)
                    } else {
                        console.error('Unexpected result type:', typeof result)
                    }
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    // //정보 수정
    async function onUserUpdate() {
        const data = {
            mno: userData!.mno,
            name: userName,
            email: userData!.email,
            phone: userPhone
        }
        try {
            await onChangeUserData(data, file)
            alert('회원정보를 수정하였습니다.')
            navigate(`/mypage/${userMno}`)
        } catch (err) {
            console.log(err)
            alert('회원정보 수정 실패')
        }
    }

    const fetchData = async () => {
        try {
            const userData = await ShowUserInfo(userMno)
            setUserData(userData)
            setProfileImage(userData.image)
            setUserName(userData.name)
            setUserPhone(userData.phone)
        } catch (error) {
            console.error('error', error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    // 회원탈퇴
    const WithdrawalId = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (window.confirm('탈퇴하시겠습니까?')) {
            try {
                await deleteId(userMno)
                alert('그동안 이용해주셔서 감사합니다.')
                localStorage.removeItem('token')
                Cookie.remove('refreshToken')
                dispatch(setUser({mno: null, role: null}))
                navigate(`/`)
            } catch (error) {
                console.log(error)
            }
        }
    }

    //취소(뒤로가기)
    function goBack() {
        navigate(-1)
    }

    return (
        <div className="w-full my-14">
            <div className="flex items-center justify-center ">
                <div className="flex flex-col items-center justify-center w-1/3 py-12 shadow-2xl rounded-3xl bg-red">
                    <Title className="my-2">정보 수정</Title>
                    <div className="flex flex-col items-center justify-center w-1/3 ">
                        <input
                            type="file"
                            className="hidden"
                            id="file"
                            name="file"
                            accept="image/*"
                            onChange={onChangeUserImage}
                            ref={fileInput}
                        />
                        <div className="w-24 h-24 my-3 overflow-hidden rounded-full cursor-pointer">
                            <img
                                src={profileImage ? profileImage : common}
                                alt="프로필사진"
                                onClick={() => {
                                    if (fileInput.current) {
                                        fileInput.current.click()
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="items-center w-1/2">
                        <LoginInput
                            className="my-3"
                            value={userName}
                            text="이름"
                            onChange={onChangeUserName}
                        />
                        <LoginInput
                            className="my-3"
                            value={userData && userData.email ? userData.email : ''}
                            text="Email (변경불가)"
                            disabled={true}
                        />
                        <LoginInput
                            className="my-3"
                            value={userPhone}
                            text="전화번호 (-빼고 입력하세요)"
                            onChange={onChangeUserPhone}
                        />
                        {userData && userData.fromSocial === false && (
                            <LoginInput
                                className="my-3"
                                value={userData && userData.birth ? userData.birth : ''}
                                text="생년월일 (변경불가)"
                                disabled={true}
                            />
                        )}

                        <div className="flex flex-col my-5">
                            <Button
                                value="수정완료"
                                className="text-white bg-lightGreen"
                                onClick={() => {
                                    onUserUpdate()
                                }}
                            />
                            {userData && userData.fromSocial === false && (
                                <Button
                                    value="비밀번호 변경"
                                    onClick={() => {
                                        navigate(`/mypage/modify/password`)
                                    }}
                                    className="text-white bg-blue-500"
                                />
                            )}
                            <Button
                                className="text-white bg-red-500"
                                value="탈퇴하기"
                                onClick={e => {
                                    WithdrawalId(e)
                                }}
                            />
                            <Button
                                className="text-white bg-black"
                                value="취소하기"
                                onClick={goBack}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
