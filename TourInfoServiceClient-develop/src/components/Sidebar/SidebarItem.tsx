import {FC, MouseEventHandler, PropsWithChildren} from 'react'

type SidebarItemProps = {
    sideTitle?: string
    onClick?: MouseEventHandler<HTMLDivElement>
}
//children은 아이콘
//sideTitle은 아이콘의 제목
export const SidebarItem: FC<PropsWithChildren<SidebarItemProps>> = ({
    children,
    sideTitle,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-center px-4 text-left transition-all duration-100 cursor-pointer h-14 hover:bg-darkGreen hover:border-r-8 hover:border-r-green-900">
            {children}
            <span className="flex justify-center w-full h-auto text-white">
                {sideTitle}
            </span>
        </div>
    )
}
