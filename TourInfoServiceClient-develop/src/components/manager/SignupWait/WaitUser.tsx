import {FC} from 'react'
import {Button, UserInfo, UserInfoItemBox} from '../../index'
import {postBusinessCheck} from '../../../api/Business/BusinessCheck'
import {SignupWaitData} from '../../../data/User/User'
import {signupApprove, userDelete} from '../../../api/Manager/Manager'
import {useDispatch} from 'react-redux'
import {setUserCheck} from '../../../store/slices/ManagerSlice'

// 유저 정보 한줄 - 추후 UserInfo로 prop 추가해줘야함

type WaitUserProps = {waitUser: SignupWaitData}

export const WaitUser: FC<WaitUserProps> = ({waitUser}) => {
    const dispatch = useDispatch()

    //사업자 확인 - 조회 버튼 누를시 사업자 번호 넘겨서 확인
    async function onCheck(b_no: string[]) {
        try {
            const data = await postBusinessCheck(b_no)
            if (data.data[0].b_stt === '' || data.data[0].b_stt === '폐업자') {
                alert('사업자 아님')
            } else if (data.data[0].b_stt === '계속사업자') {
                alert('사업자 확인 완료')
            } else if (data.data[0].b_stt === '휴업자') {
                alert('현재 휴업자')
            }
        } catch (err) {
            console.log(err)
        }
    }

    //회원가입 승인
    async function onApprove(mno: number) {
        try {
            const data = await signupApprove(mno)
            if (data.mno == mno.toString()) {
                dispatch(setUserCheck())
                alert('회원가입 승인 하였습니다.')
            } else {
                alert('회원가입 승인 실패 하였습니다.')
            }
        } catch (err) {
            console.log(err)
        }
    }

    //회원가입 거절
    async function onReject(mno: number) {
        try {
            const data = await userDelete(mno)
            if (data.mno == mno.toString()) {
                dispatch(setUserCheck())
                alert('회원가입 거절 하였습니다.')
            } else {
                alert('회원가입 거절 실패 하였습니다.')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <UserInfoItemBox widthFull={false} isButton={true}>
            <div className="flex">
                <UserInfo text={waitUser.mno.toString()} />
                <UserInfo text={waitUser.name} />
                <UserInfo text={waitUser.email} />
                <UserInfo text={waitUser.businessId} />
            </div>

            <div className="flex justify-around p-3 min-w-fit">
                <Button
                    value="조회"
                    className="bg-white text-green-700 hover:text-white border border-green-700 hover:bg-green-800  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 "
                    onClick={() => onCheck([waitUser.businessId.toString()])}
                />
                <Button
                    value="승인"
                    className="bg-white text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 "
                    onClick={() => {
                        onApprove(waitUser.mno)
                    }}
                />
                <Button
                    value="삭제"
                    className="bg-white text-red-700 hover:text-white border border-red-700 hover:bg-red-800  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600"
                    onClick={() => {
                        onReject(waitUser.mno)
                    }}
                />
            </div>
        </UserInfoItemBox>
    )
}
