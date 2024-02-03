import React, {useEffect, useRef, useState} from 'react'
import {BoardBox} from '../place/BoardBox'
import {CourseInfo} from './CourseInfo'
import {CourseBoardListData} from '../../data/Board/BoardData'
import {LoadingSppinnerSmall, MiniSppinner} from '../LoadingSpinner'
import {getSearchCourseInfo} from '../../api/CourseSearch/CourseSearch'
import {useSearchParams} from 'react-router-dom'

type CourseSearchItemProps = {
    isAd: boolean
    searchValue: string
}

const CourseSearchItem: React.FC<CourseSearchItemProps> = ({isAd, searchValue}) => {
    const boardInfoRef = useRef(null) // 관찰할 요소에 대한 참조

    const [boardInfoRequest, setBoardInfoRequest] = useState<boolean>(true)
    const [page, setPage] = useState<number>(1)

    const [searchParams, setSearchParams] = useSearchParams()
    const initialSearch = searchParams.get('search') || ''
    const [loading, setLoading] = useState<Boolean>(false)

    // 검색 결과 데이터 - 유저
    const [boardInfoData, setBoardInfoData] = useState<CourseBoardListData[] | null>(null)

    async function onCourseList() {
        try {
            setLoading(true)
            // setSearchParams({search: searchValue})
            const data = await getSearchCourseInfo(searchValue, 0, isAd)
            console.log(data)
            setBoardInfoData(data)
            // const data2 = await getSearchCourseInfo(searchValue, 0, true)
            // setBoardInfoAdData(data2)
            setPage(1)
            setBoardInfoRequest(true)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }
    useEffect(() => {
        onCourseList()
    }, [searchParams])

    //스크롤 조회
    async function onInfinityList() {
        try {
            const data = await getSearchCourseInfo(searchValue, page, isAd)
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.length === 0) {
                observer.disconnect()
                boardInfoData !== null && setBoardInfoRequest(false)
                return
            }
            boardInfoData !== null && setBoardInfoData([...boardInfoData, ...data])
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            boardInfoRequest === true && onInfinityList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (boardInfoRef.current) {
            observer.observe(boardInfoRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (boardInfoRef.current) {
                observer.unobserve(boardInfoRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [boardInfoData, boardInfoRequest, boardInfoRef])

    return (
        <BoardBox className="relative flex flex-col">
            {loading && <LoadingSppinnerSmall />}
            {boardInfoData ? (
                boardInfoData.map((data: CourseBoardListData, index) => (
                    <CourseInfo key={index} boardData={data} />
                ))
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <p className="text-xl font-bold">게시글이 없습니다...</p>
                </div>
            )}
            {boardInfoData?.length !== 0 &&
                (boardInfoRequest ? (
                    <div className="my-5" ref={boardInfoRef}>
                        <MiniSppinner />
                    </div>
                ) : (
                    <div className="my-5">•</div>
                ))}
        </BoardBox>
    )
}

export default CourseSearchItem
