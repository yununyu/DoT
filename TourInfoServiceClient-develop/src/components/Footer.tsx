import {FC} from 'react'
import {Outlet} from 'react-router-dom'

type FooterProps = {}

export const Footer: FC<FooterProps> = ({}) => {
    return (
        <div>
            <Outlet />
            <footer className="items-center justify-center hidden w-full text-xs text-center text-gray-300 md:flex bg-slate-600">
                <div className="flex-row items-center justify-center py-2">
                    <p className="m-2">배낭 가져와 - 여행의 발견 (Discovery of Travel)</p>
                    {/* 아래 수정해야함(깃허브 주소 추후 수정) */}
                    <p className="m-2">
                        Git Hub :&nbsp;
                        <a
                            href="https://github.com/sb3827/TourInfoServiceClient"
                            className="text-gray-300 underline cursor-pointer hover:text-gray-300 hover:underline">
                            https://github.com/sb3827/TourInfoServiceClient
                        </a>
                    </p>
                    <p className="m-2">Copyright 2024 All &copy; rights reserved</p>
                </div>
            </footer>
        </div>
    )
}
