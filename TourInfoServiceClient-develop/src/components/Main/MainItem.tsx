import {FC, PropsWithChildren} from 'react'
import {MainBoardData, MainPlaceData} from '../../data/Main/Main'
import noImage from '../../assets/smallLogo.png'
import {faCartShopping, faHeart, faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type MainItemProps = {
    onClick?: () => void
    mainBoard: MainBoardData
}

export const MainItem: FC<PropsWithChildren<MainItemProps>> = ({onClick, mainBoard}) => {
    return (
        <div
            className="flex flex-col mx-10 overflow-hidden duration-150 bg-white border-2 rounded-lg shadow-md hover:cursor-pointer hover:-translate-y-2 hover:shadow-xl"
            onClick={onClick}>
            <div className="flex justify-center w-full overflow-hidden">
                <img
                    src={mainBoard?.src ? mainBoard?.src : noImage}
                    alt={mainBoard.title}
                    className="duration-150 h-60 hover:scale-110"
                />
            </div>
            {/* <div className="p-4 border-t-2">
                <h3 className="mb-2 text-xl font-semibold">{mainBoard.title}</h3>
            </div> */}
            <div className="flex flex-col w-full h-full px-3 py-1 border-t">
                <div className="flex items-center justify-center flex-auto">
                    <p className="text-2xl font-bold text-darkGreen">{mainBoard.title}</p>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col items-start justify-center flex-1">
                        <p className="flex items-center justify-center mr-2">
                            {mainBoard.name}
                        </p>
                        <p className="flex items-center justify-center text-sm text-gray-500">
                            {mainBoard.regDate.slice(0, 10)}
                        </p>
                    </div>

                    <div className="flex items-end justify-end flex-1">
                        <div className="mr-2">
                            <FontAwesomeIcon icon={faStar} size="lg" color="gold" />
                            <p className="text-sm">{mainBoard.score}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faHeart} size="lg" color="red" />
                            <p className="text-sm">{mainBoard.likes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type MainPlaceProps = {
    onClick?: () => void
    mainPlace: MainPlaceData
}

export const MostLikedMainItem: FC<PropsWithChildren<MainPlaceProps>> = ({
    mainPlace,
    onClick
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 overflow-hidden mx-14">
            <div
                onClick={onClick}
                className="flex flex-col items-center w-2/5 overflow-hidden duration-150 bg-white border-2 shadow-xl hover:cursor-pointer rounded-3xl hover:shadow-2xl">
                <div className="flex justify-center w-full overflow-hidden">
                    <img
                        src={mainPlace?.src ? mainPlace.src : noImage}
                        alt={mainPlace.name}
                        className="duration-150 h-80 hover:scale-110"
                    />
                </div>
                <div className="flex flex-col w-full h-full p-5 border-t">
                    <div className="flex justify-between w-full">
                        <div className="flex items-center justify-start flex-1">
                            <p>
                                {mainPlace.category === 'SIGHT'
                                    ? '관광지'
                                    : mainPlace.category === 'RESTAURANT'
                                    ? '음식점'
                                    : mainPlace.category === 'LODGMENT'
                                    ? '숙소'
                                    : '기타'}
                            </p>
                        </div>
                        <div className="flex items-center justify-center flex-auto">
                            <p className="text-2xl font-bold text-darkGreen">
                                {mainPlace.name}
                            </p>
                        </div>

                        <div className="flex flex-col items-end justify-center flex-1">
                            <p className="text-sm text-gray-500">
                                <p className="flex items-center justify-end">
                                    <FontAwesomeIcon
                                        icon={faCartShopping}
                                        size="1x"
                                        className="mx-2"
                                    />
                                    {mainPlace.cart}
                                </p>
                                {mainPlace.board_count}개의 게시글
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const MostLikedCourseItem: FC<PropsWithChildren<MainItemProps>> = ({
    onClick,
    mainBoard
}) => {
    return (
        <div
            className="flex flex-col justify-between flex-1 overflow-hidden bg-white hover:cursor-pointer"
            onClick={onClick}>
            <div className="flex justify-center w-full overflow-hidden basis-11/12">
                <img
                    src={mainBoard?.src ? mainBoard.src : noImage}
                    alt={mainBoard.name}
                    className="h-full duration-150 hover:scale-110"
                />
            </div>
            <div className="w-full px-6 py-3 border-t-2 basis-1/12">
                <div className="flex items-center justify-center flex-auto">
                    <p className="text-2xl font-bold text-darkGreen">{mainBoard.title}</p>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col items-start justify-center ">
                        <p className="flex items-center justify-center mr-2">
                            {mainBoard.name}
                        </p>
                        <p className="flex items-center justify-center text-sm text-gray-500">
                            {mainBoard.regDate.slice(0, 10)}
                        </p>
                    </div>

                    <div className="flex items-end justify-end ">
                        <div className="mr-2">
                            <FontAwesomeIcon icon={faStar} size="lg" color="gold" />
                            <p className="text-sm">{mainBoard.score}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faHeart} size="lg" color="red" />
                            <p className="text-sm">{mainBoard.likes}</p>
                        </div>
                    </div>
                </div>{' '}
            </div>
        </div>
    )
}
