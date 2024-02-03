import {FC} from 'react'
import {useNavigate} from 'react-router-dom'
import {CourseBoardListData} from '../../data/Board/BoardData'
import {faHeart, faStar} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import noImage from '../../assets/smallLogo.png'

type CourseInfoProps = {
    boardData: CourseBoardListData | null
}

export const CourseInfo: FC<CourseInfoProps> = ({boardData}) => {
    const navigate = useNavigate()

    const imageArray =
        boardData?.srcList &&
        (boardData.srcList.length > 0 ? (
            boardData.srcList.map((src, index) => (
                <div key={index} className="flex justify-center h-full overflow-hidden">
                    <img
                        src={src ? src : noImage}
                        alt="Image"
                        className="h-full duration-150 hover:scale-110"
                    />
                </div>
            ))
        ) : (
            <div className="flex justify-center h-full overflow-hidden">
                <img
                    src={noImage}
                    alt="Image"
                    className="h-full duration-150 hover:scale-110"
                />
            </div>
        ))

    const handleReviewClick = () => {
        navigate(`/board/course/posting?bno=${boardData?.bno}`)
    }

    return (
        <div
            className="flex flex-col items-center justify-center w-full my-5 shadow-2xl cursor-pointer h-96 border-lightGreen rounded-2xl "
            onClick={handleReviewClick}>
            <div className="flex justify-center w-full h-full overflow-hidden">
                {imageArray}
            </div>

            <div className="relative flex items-center justify-between w-full p-3 ">
                <div className="flex flex-col w-full">
                    <p className="my-3 text-xl font-bold">{boardData?.title}</p>
                    <div className="flex flex-col px-3 text-left text-gray-500">
                        <p className="">{boardData?.writer}</p>
                        <p className="">{boardData?.regDate.slice(0,10)}</p>
                    </div>
                    <div className="absolute flex items-center justify-center top-3 right-5">
                        <div className="mr-2">
                            <FontAwesomeIcon icon={faStar} size="lg" color="gold" />
                            <p className="text-sm">{boardData?.score}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faHeart} size="lg" color="red" />
                            <p className="text-sm">{boardData?.likes}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
