import React, {
    Children,
    DetailedHTMLProps,
    FC,
    HTMLAttributes,
    PropsWithChildren
} from 'react'

type ReactDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

type UserInfoItemBoxProps = ReactDivProps &
    PropsWithChildren & {
        widthFull: boolean
        justifyAround?: string
        pointer?: boolean
        isButton?: boolean
    }
export const UserInfoItemBox: FC<UserInfoItemBoxProps> = ({
    children,
    onClick,
    widthFull,
    justifyAround,
    pointer,
    isButton
}) => {
    const result = Children.toArray(children)
    return (
        <div
            className={`flex items-center w-full border-b-2 min-w-max ${
                pointer ? 'cursor-pointer' : ''
            }`}
            onClick={onClick}>
            <div className={`p-3 ${widthFull ? 'w-full' : 'w-3/4'}`}>
                <div className={`flex w-full ${justifyAround}`}>{result[0]}</div>
            </div>
            {isButton ? (
                <div className="flex justify-end w-1/4 p-3 min-w-fit">{result[1]}</div>
            ) : (
                ''
            )}
        </div>
    )
}
