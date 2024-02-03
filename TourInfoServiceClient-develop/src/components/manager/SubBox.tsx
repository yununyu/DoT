import React, {FC, PropsWithChildren} from 'react'

//내부 박스 스타일

type SubBoxProps = {
    className?: string
}

export const SubBox: FC<PropsWithChildren<SubBoxProps>> = ({children, className}) => {
    const subBoxStyle = `p-3 overflow-y-auto bg-white border border-gray-300 rounded-lg h-96 max-h-96 ${className}`
    return (
        <div className="flex justify-center w-full mb-5">
            <div className="flex flex-col w-2/3 ">
                <div className={subBoxStyle}>{children}</div>
            </div>
        </div>
    )
}
