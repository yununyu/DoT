import React, {FC} from 'react'

//WaitUser에 사용될 아이템들(이름,아이디 등등) - 추후 props 추가(속성값 추가해줘야함, value 값)

type UserInfoProps = {
    text: string
}

export const UserInfo: FC<UserInfoProps> = ({text}) => {
    return (
        <div className="w-40 p-3 overflow-hidden whitespace-nowrap text-ellipsis ">
            <span>{text}</span>
        </div>
    )
}
