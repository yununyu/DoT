import {FC, PropsWithChildren, useEffect, useState} from 'react'
import {
    Title,
    TextBox,
    CoursePostMap,
    PlaceProps,
    DropIcon,
    CourseList,
    MainSlider,
    LoadingSppinner
} from '../../components'
import {Reply} from '../Reply'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faHeart, faEllipsisVertical, faStar} from '@fortawesome/free-solid-svg-icons'
import noImage from '../../assets/smallLogo.png'
import {coursePostLoad, deleteBoard, deleteLike, postLike} from '../../api/Board/board'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {useNavigate, useSearchParams} from 'react-router-dom'
import BoardReportModal from '../../components/board/BoardReportModal'
import {BoardData} from '../../data/Board/BoardData'
import {getCookie} from '../../util/cookie'
import {SwiperSlide} from 'swiper/react'

type DetailedCourseType = {
    title?: string
}

export const DetailedCourse: FC<PropsWithChildren<DetailedCourseType>> = () => {
    const postText = ['수정', '신고', '삭제']
    const [day, setDay] = useState(useSelector((state: RootState) => state.course))
    const [enables, setEnables] = useState<boolean[]>([false, true, false])
    const [content, setContent] = useState<string>('')
    const [score, setScore] = useState<number>(5)
    const [likes, setLikes] = useState<number>(0)
    const [date, setDate] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const [images, setImages] = useState<string[]>(['none'])
    const [writer, setWriter] = useState<string>('undefined')
    const [writerNo, setWriterNo] = useState<number>()
    const [placesList, setPlacesList] = useState<PlaceProps[][]>([
        [
            {
                name: '서면 거리',
                lat: 35.1584,
                lng: 129.0583,
                roadAddress: '부산광역시 서구 중앙대로 678',
                localAddress: '부산광역시 서구 서면',
                engAddress: '678, Jungang-daero, Seo-gu, Busan'
            }
        ]
    ])

    // user mno
    const user = useSelector((state: RootState) => state.login.mno)!
    const [searchParams] = useSearchParams()
    const bno = searchParams.get('bno')!
    const [report, setReport] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()
    // left arrow button
    function backPage() {
        // 뒤로가기 로직
        navigate(-1)
    }

    const delPage = () => {
        try {
            deleteBoard(parseInt(bno))
            alert('삭제 성공')
            navigate('/board/place')
        } catch (error) {
            alert('삭제 실패')
        }
    }

    async function loadPage() {
        setLoading(true)
        try {
            const data = await coursePostLoad(
                parseInt(bno),
                getCookie('refreshToken') != undefined
            )
            console.log(data)
            if (!data.isCourse) {
                // 코스정보 에러 처리(front)
                throw new Error('Not Found')
            }
            setWriterNo(data.writerDTO.mno)
            if (user === data.writerDTO.mno) {
                setEnables([true, false])
            }
            setTitle(data.title) // title
            setScore(data.score) // number of star
            setLikes(data.likes) // number of likes
            setWriter(data.writerDTO.name) // writer
            setLikes(data.likes) // number of likes
            if (data.moddate == data.regdate) {
                setDate('작성일자: ' + data.regdate)
            } else {
                setDate('수정일자: ' + data.moddate)
            }
            // setImages
            if (data.images.length > 0) setImages(data.images)
            else setImages([noImage])
            setPlacesList(data.postingPlaceBoardDTOS)

            setContent(data.content) // content

            setDay(
                data.postingPlaceBoardDTOS.map(daliyPlace =>
                    daliyPlace.map(place => ({
                        pno: place.pno,
                        pname: place.name,
                        img: place.src
                    }))
                )
            )
        } catch (error) {
            navigate('/notfound')
        }
        setLoading(false)
    }

    // heart button state
    const [heart, setHeart] = useState<boolean>(false)
    function clickHeart() {
        try {
            // if (!user) return
            if (heart) {
                setLikes(likes - 1)
                deleteLike(user, parseInt(bno))
            } else {
                postLike(user, parseInt(bno))
                setLikes(likes + 1)
            }
            setHeart(!heart)
            console.log(date)
        } catch (error) {
            if (heart) {
                setLikes(likes + 1)
            } else {
                setLikes(likes - 1)
            }
            setHeart(!heart)
        }
    }

    useEffect(() => {
        loadPage()
    }, [])

    // report
    const nav = () => navigate(`/board/course/posting/modify?bno=${bno}`)
    const closeModal = () => {
        setReport(false)
    }
    const set = () => setReport(true)
    const boardData: BoardData = {
        bno: parseInt(bno),
        title: title,
        content: content,
        mno: writerNo as number,
        name: writer as string
    }

    return (
        <div className="w-7/12 py-10 mx-auto my-10 shadow-2xl px-14 rounded-2xl">
            {loading && <LoadingSppinner />}
            <div className="py-5 ">
                <div className="flex flex-col ">
                    <div className="flex items-center justify-between">
                        <Title className="my-5 text-5xl">{title}</Title>
                        <div className="flex flex-row justify-end">
                            <div className="flex flex-col mx-2 text-gray-500">
                                <FontAwesomeIcon icon={faStar} size="xl" color="gold" />
                                {score}
                            </div>
                            <div className="flex flex-col mx-2 text-gray-500">
                                {heart && (
                                    <FontAwesomeIcon
                                        className="hover:cursor-pointer"
                                        icon={faHeart}
                                        size="xl"
                                        color="red"
                                        onClick={clickHeart}
                                    />
                                )}
                                {heart || (
                                    <FontAwesomeIcon
                                        className="hover:cursor-pointer"
                                        icon={faHeart}
                                        size="xl"
                                        style={{color: '#c2c2c2'}}
                                        onClick={clickHeart}
                                    />
                                )}
                                {likes}
                            </div>
                            {user && (
                                <DropIcon
                                    itemTexts={postText}
                                    itemActions={[nav, set, delPage]}
                                    itemEnabled={enables}>
                                    <FontAwesomeIcon
                                        className="ml-2 hover:cursor-pointer"
                                        icon={faEllipsisVertical}
                                        size="xl"
                                    />
                                </DropIcon>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between w-full my-5">
                        <div>
                            <div className="flex flex-row justify-start">
                                작성자: {writer}
                            </div>
                            <div className="flex flex-row justify-end">
                                {date.slice(0, 16)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {/*body*/}
                <div className="flex flex-row items-center justify-center mb-5">
                    <MainSlider className="w-full overflow-hidden border-none rounded-3xl">
                        {placesList.map((places, idx) => (
                            <SwiperSlide className="rounded-3xl" key={idx}>
                                <div
                                    key={idx}
                                    className="relative flex flex-col justify-center w-full">
                                    {places.length > 0 && (
                                        <div>
                                            <p className="text-xl font-bold">{`DAY-${
                                                idx + 1
                                            }`}</p>
                                        </div>
                                    )}
                                    <CoursePostMap
                                        places={places}
                                        className="rounded-3xl"></CoursePostMap>
                                </div>
                            </SwiperSlide>
                        ))}
                    </MainSlider>
                </div>
                <div>
                    <CourseList create={false} day={day} />
                </div>
                <div
                    id="board_box"
                    className="p-5 my-10 overflow-hidden shadow-xl rounded-3xl">
                    <TextBox data={content}></TextBox>
                </div>
            </div>
            <div className="flex w-full border-b-2 border-lightGreen">
                <p className="mx-5 mt-8 mb-3 text-3xl font-semibold text-darkGreen">
                    댓글
                </p>
            </div>
            <div>
                <Reply />
            </div>
            {report && (
                <BoardReportModal
                    boardData={boardData}
                    onCloseModal={closeModal}></BoardReportModal>
            )}
        </div>
    )
}
