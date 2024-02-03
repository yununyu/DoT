import {FC, PropsWithChildren, HTMLAttributes} from 'react'

type BoxProps = {
    className?: string
}

export const Box: FC<PropsWithChildren<BoxProps>> = ({children, className}) => {
    const BoxStyle = `flex flex-col items-center justify-center w-full py-14 ${className}`
    return <div className={BoxStyle}>{children}</div>
}
