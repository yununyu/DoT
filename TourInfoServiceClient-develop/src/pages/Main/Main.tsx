import {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {
    SearchInput,
    Subtitle,
    Button,
    MainItem,
    MostLikedCourseItem,
    MostLikedMainItem,
    CoursePostMap,
    MainSlider,
    LoadingSppinner
} from '../../components'
import {RootState} from '../../store/rootReducer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMapLocationDot, faRoute, faUsers} from '@fortawesome/free-solid-svg-icons'
import MainFilter from '../../components/Main/MainFilter'
import {SwiperSlide} from 'swiper/react'
import {GetMainitemRequest} from '../../api/Main/Main'
import {mainItemData} from '../../data/Main/Main'

type MainProps = {}

export const Main: FC<MainProps> = () => {
    const [loading, setLoading] = useState<Boolean>(false)
    const [searchValue, setSearchValue] = useState<string>('')
    const [filterValue, setFilterValue] = useState<string>('place')
    const [fetchedData, setFetchedData] = useState<mainItemData | null>(null)
    const navigate = useNavigate()
    const [preView, setPreView] = useState(3)

    // 화면 폭에 따라 Slider 의 preView 값을 동적으로 조절
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth
            if (screenWidth <= 794) {
                setPreView(1)
            } else if (screenWidth <= 1200) {
                setPreView(2)
            } else {
                setPreView(3)
            }
        }

        // 페이지 로딩 시와 화면 크기 변경 시에 이벤트 핸들러 등록
        handleResize()
        window.addEventListener('resize', handleResize)

        // 컴포넌트 언마운트 시 이벤트 핸들러 제거
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // 상세 페이지 이동
    function mostPostingDetailView(index: number) {
        if (fetchedData && fetchedData.data.mostBoardPlace[index].pno) {
            navigate(`/board/place/${fetchedData.data.mostBoardPlace[index].pno}`)
        }
    }

    function recentlyDetailView(index: number) {
        if (fetchedData && fetchedData.data.recentlyBoard[index].bno) {
            console.log(
                'isCourse ====>>> ' + fetchedData.data.recentlyBoard[index].course
            )
            if (fetchedData.data.recentlyBoard[index].course === true) {
                navigate(
                    `/board/course/posting?bno=${fetchedData.data.recentlyBoard[index].bno}`
                )
            } else {
                navigate(
                    `/board/place/posting?bno=${fetchedData.data.recentlyBoard[index].bno}`
                )
            }
        }
    }

    function mostLikedCourseDetailView(index: number) {
        if (
            fetchedData &&
            fetchedData.data.mostLikeCourse[index].mainBoardResponseDTO.bno
        ) {
            navigate(
                `/board/course/posting?bno=${fetchedData.data.mostLikeCourse[index].mainBoardResponseDTO.bno}`
            )
        }
    }

    function followDetailView(index: number) {
        if (fetchedData && fetchedData.data.followBoard[index].bno) {
            if (fetchedData.data.followBoard[index].course === true) {
                navigate(
                    `/board/course/posting?bno=${fetchedData.data.followBoard[index].bno}`
                )
            } else {
                navigate(
                    `/board/place/posting?bno=${fetchedData.data.followBoard[index].bno}`
                )
            }
        }
    }

    function adDetailView(index: number) {
        if (fetchedData && fetchedData.data.adBoard[index].bno) {
            if (fetchedData.data.adBoard[index].course === true) {
                navigate(
                    `/board/course/posting?bno=${fetchedData.data.adBoard[index].bno}`
                )
            } else {
                navigate(
                    `/board/place/posting?bno=${fetchedData.data.adBoard[index].bno}`
                )
            }
        }
    }

    //searchValue state 변경
    function onSetSearchValue(value: string) {
        setSearchValue(value)
    }

    // filter value state 변경
    function onSetFilterValue(filter: string) {
        setFilterValue(filter)
    }

    // 검색
    async function onSearch(
        e?: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
    ) {
        if (
            e?.type === 'keydown' &&
            (e as React.KeyboardEvent<HTMLInputElement>).key !== 'Enter'
        ) {
            return
        }
        if (filterValue === 'place') {
            navigate(`/board/place?filter=&search=${searchValue}`)
        }
        if (filterValue === 'course') {
            navigate(`/board/course?search=${searchValue}`)
        }
        if (filterValue === 'user') {
            navigate(`/search-user?search=${searchValue}`)
        }
    }

    // 메인 아이템 로딩 useEffect
    const mno = useSelector((state: RootState) => state.login.mno)

    const fetchData = async () => {
        try {
            setLoading(true)
            const data = await GetMainitemRequest(mno)
            console.log('Fetched data:', data)
            setFetchedData(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [mno])

    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex justify-center w-11/12">
                {loading && <LoadingSppinner />}
                <div className="w-4/5 mt-10 ">
                    <div className="flex flex-col items-center justify-center">
                        <p className="mb-4 text-lg font-semibold text-green-800">
                            국내 여행 후기를 한눈에,
                            <br /> 여러분의 다음 여행지를 찾아보세요!
                        </p>
                        <div className="flex justify-around w-1/3 py-2 shadow-xl bg-green-50 rounded-xl">
                            <MainFilter
                                text="장소"
                                filterChange={onSetFilterValue}
                                color={
                                    filterValue === 'place'
                                        ? 'bg-lightGreen text-white'
                                        : 'hover:text-darkGreen'
                                }>
                                <FontAwesomeIcon icon={faMapLocationDot} />
                            </MainFilter>
                            <MainFilter
                                text="코스"
                                filterChange={onSetFilterValue}
                                color={
                                    filterValue === 'course'
                                        ? 'bg-lightGreen text-white'
                                        : 'hover:text-darkGreen'
                                }>
                                <FontAwesomeIcon icon={faRoute} />
                            </MainFilter>
                            <MainFilter
                                text="유저"
                                filterChange={onSetFilterValue}
                                color={
                                    filterValue === 'user'
                                        ? 'bg-lightGreen text-white'
                                        : 'hover:text-darkGreen'
                                }>
                                <FontAwesomeIcon icon={faUsers} />
                            </MainFilter>
                        </div>
                        <div className="flex justify-center w-full my-8">
                            <SearchInput
                                value={searchValue}
                                className="w-2/3"
                                onChange={onSetSearchValue}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        onSearch(e)
                                    }
                                }}
                                placeholder="장소/코스/유저 선택해서 검색"
                            />
                            <Button
                                className="text-white shadow-xl bg-darkGreen"
                                value={'검색'}
                                onClick={onSearch}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="container px-10 mb-20 shadow-2xl py-14 bg-green-50 rounded-3xl bg-opacity-80">
                            <Subtitle
                                className="text-2xl font-bold text-green-900"
                                value='" 많은 이들이 극찬한 명소, 그 인기의 이유를 직접 확인하세요 "'
                            />
                            <MainSlider preView={1}>
                                {fetchedData &&
                                    fetchedData.data.mostBoardPlace &&
                                    fetchedData.data.mostBoardPlace.map(
                                        (mostLiked, index) => (
                                            <SwiperSlide key={index}>
                                                <MostLikedMainItem
                                                    onClick={() =>
                                                        mostPostingDetailView(index)
                                                    }
                                                    mainPlace={mostLiked}
                                                />
                                            </SwiperSlide>
                                        )
                                    )}
                            </MainSlider>
                        </div>
                    </div>

                    <div className="px-10 mb-20 shadow-2xl bg-opacity-60 py-14 rounded-3xl bg-emerald-50 ">
                        <Subtitle
                            className="flex items-start mb-4 ml-16 text-2xl font-bold "
                            value="최근 장소 포스팅"
                        />
                        <MainSlider preView={preView}>
                            {fetchedData &&
                                fetchedData.data.recentlyBoard &&
                                fetchedData.data.recentlyBoard.map((recently, index) => (
                                    <SwiperSlide key={index} className="p-2">
                                        <MainItem
                                            onClick={() => recentlyDetailView(index)}
                                            mainBoard={recently}
                                            // title={recently.title}
                                            // image={recently.src ?? noImage}
                                        />
                                    </SwiperSlide>
                                ))}
                        </MainSlider>
                    </div>

                    <div className="px-10 mb-20 shadow-2xl bg-opacity-60 py-14 rounded-3xl bg-sky-50">
                        <Subtitle
                            className="flex items-start mb-4 ml-16 text-2xl font-bold "
                            value="가장 많은 추천을 받은 코스"
                        />

                        <MainSlider preView={1}>
                            {fetchedData &&
                                fetchedData.data.mostLikeCourse &&
                                fetchedData.data.mostLikeCourse.map((course, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="flex justify-around p-2">
                                            <div
                                                className="flex w-10/12 overflow-hidden duration-150 border-2 rounded-3xl hover:shadow-2xl h-96"
                                                onClick={() =>
                                                    mostLikedCourseDetailView(index)
                                                }>
                                                <MostLikedCourseItem
                                                    mainBoard={
                                                        course.mainBoardResponseDTO
                                                    }
                                                />
                                                <div className="relative flex-1 w-1/2">
                                                    <CoursePostMap
                                                        onClick={event =>
                                                            event.stopPropagation()
                                                        }
                                                        className="z-10 h-full"
                                                        places={course.placeList}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                        </MainSlider>
                    </div>
                    {mno !== null && fetchedData && (
                        <div className="px-10 mb-20 shadow-2xl py-14 rounded-3xl bg-blue-50 bg-opacity-60">
                            <Subtitle
                                className="flex items-start mb-4 ml-16 text-2xl font-bold "
                                value="팔로워들의 게시물"
                            />
                            {fetchedData.data.followBoard.length > 0 ? (
                                <MainSlider preView={preView}>
                                    {fetchedData.data.followBoard.map((follow, index) => (
                                        <SwiperSlide key={index} className="p-2">
                                            <MainItem
                                                onClick={() => followDetailView(index)}
                                                mainBoard={follow}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </MainSlider>
                            ) : (
                                <Subtitle
                                    className="mb-5 text-2xl font-bold text-darkGreen"
                                    value='" 팔로잉중인 유저가 없습니다... "'
                                />
                            )}
                        </div>
                    )}
                    {fetchedData &&
                        fetchedData.data.adBoard &&
                        fetchedData.data.adBoard.length > 0 && (
                            <div className="px-10 mb-20 shadow-2xl py-14 rounded-3xl bg-orange-50 bg-opacity-60">
                                <Subtitle
                                    className="flex items-start mb-4 ml-16 text-2xl font-bold "
                                    value="광고"
                                />
                                <MainSlider preView={preView}>
                                    {fetchedData.data.adBoard.map((ad, index) => (
                                        <SwiperSlide key={index} className="p-2">
                                            <MainItem
                                                onClick={() => adDetailView(index)}
                                                mainBoard={ad}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </MainSlider>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
