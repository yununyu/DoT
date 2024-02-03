import React, {FC, PropsWithChildren} from 'react'

//내부 박스 스타일

type SubBoxProps = {
    className?: string
}

export const BoardBox: FC<PropsWithChildren<SubBoxProps>> = ({children, className}) => {
    const subBoxStyle = `p-3 overflow-y-auto bg-white border border-lightGreen rounded-lg h-screen  ${className}`
    return (
        <div className="flex justify-center w-full mb-5 ">
            <div className="relative flex flex-col w-full ">
                <div className={subBoxStyle}>{children}</div>
            </div>
        </div>
    )
}
