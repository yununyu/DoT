import {FC, useEffect, useState} from 'react'
import {Button, Modal, UserInfo, UserInfoItemBox} from '../../index'
import {ManagerSearchUserData} from '../../../data/User/User'
import {getUserDisciplinary} from '../../../api'
import {DisciplinaryUserData} from '../../../data/manager'
import {userDelete} from '../../../api/Manager/Manager'
import {useDispatch} from 'react-redux'
import {setUserCheck} from '../../../store/slices/ManagerSlice'

type FindUserInfoProps = {
    users: ManagerSearchUserData
}

export const FindUserInfo: FC<FindUserInfoProps> = ({users}) => {
    const dispatch = useDispatch()

    const [isModalOpen, setModalOpen] = useState<boolean>(false)
    const [disciplinaryData, setDisciplinaryData] = useState<DisciplinaryUserData | null>(
        null
    )

    const openModal = () => setModalOpen(true)
    const closeModal = () => setModalOpen(false)

    //유저 제재 조회
    async function onDisciplinaryAll() {
        try {
            const data = await getUserDisciplinary(users.mno)
            setDisciplinaryData(data)
        } catch (err) {
            console.log(err)
        }
    }

    //회원 삭제
    async function onRemoveUser() {
        const remind = window.confirm('회원을 탈퇴 시키겠습니까?')
        if (remind) {
            try {
                const data = await userDelete(users.mno)
                dispatch(setUserCheck())
                alert('회원 삭제 하였습니다.')
            } catch (err) {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        onDisciplinaryAll()
    }, [])

    return (
        <div>
            <UserInfoItemBox
                widthFull={false}
                isButton={true}
                onClick={openModal}
                pointer>
                <div className="flex">
                    <UserInfo text={users.mno.toString()} />
                    <UserInfo text={users.name} />
                    <UserInfo text={users.email} />
                    <UserInfo text={users.phone ? users.phone : '0'} />
                    <UserInfo text={users.regDate} />
                    <UserInfo
                        text={users.role === 'BUSINESSPERSON' ? '사업자' : '일반 회원'}
                    />
                </div>
            </UserInfoItemBox>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="flex flex-row items-center justify-center">
                    <h1 className="text-xl font-bold">유저정보</h1>
                </div>

                <p className="mt-4">회원 번호 : {users.mno}</p>
                <p className="mt-4">이름 : {users.name}</p>
                <p className="mt-4">이메일 : {users.email}</p>
                <p className="mt-4">전화번호 : {users.phone ? users.phone : '0'}</p>
                <p className="mt-4">가입일 : {users.regDate}</p>
                <p className="mt-4">
                    사업자여부 :{users.role === 'BUSINESSPERSON' ? '사업자' : '일반 회원'}
                </p>

                <p className="my-2 font-bold break-all">- 제재 이력 -</p>
                <div className="flex-col border">
                    <div className="flex justify-between p-2 border-b">
                        <span className="flex-1">정지 시작일</span>
                        <span className="flex-1">정지 종료일 </span>
                        <span className="flex-1"> 정지 사유 </span>
                    </div>
                    {disciplinaryData?.data.map((data, index) => (
                        <div key={index} className="flex justify-between p-3">
                            <span className="flex-1">
                                {index + 1}. {data.strDate}
                            </span>
                            <span className="flex-1"> {data.expDate}</span>
                            <span className="flex-1"> {data.reason}</span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center p-3 min-w-fit">
                    <Button
                        value="탈퇴"
                        className="bg-white text-red-700 hover:text-white border border-red-700 hover:bg-red-800  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 "
                        onClick={onRemoveUser}
                    />
                </div>
            </Modal>
        </div>
    )
}
