import {FC, useEffect, useRef, useState} from 'react'
import {BoardBox} from './BoardBox'
import {Board} from './Board'
import {PlaceBoardData} from '../../data/placeSearch'
import {getPlaceDetailsInfo} from '../../api'
import {useNavigate, useParams} from 'react-router-dom'
import {LoadingSppinnerSmall, MiniSppinner} from '../LoadingSpinner'

type PlaceDetailsItemProps = {
    getPlaceData?: (placeData: PlaceBoardData) => void
    pno: number
    isAd: Boolean
}

const PlaceDetailsItem: FC<PlaceDetailsItemProps> = ({isAd, getPlaceData}) => {
    const navigate = useNavigate()
    const {pno} = useParams()

    const boardRef = useRef(null) // 관찰할 요소에 대한 참조

    const [page, setPage] = useState<number>(0)
    const [boardRequest, setBoardRequest] = useState<boolean>(true)

    const [boardData, setBoardData] = useState<PlaceBoardData[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    //초기 데이터
    async function fetchData() {
        // const pnoNumber = pnoParam ? Number(pno) : undefined // pno를 숫자로 변환
        try {
            setLoading(true)
            const data = await getPlaceDetailsInfo(Number(pno), 0, isAd)
            if (data?.length == 0) {
                alert('해당 장소가 없습니다.')
                navigate(-1)
                return
            }
            data && setBoardData(data)
            getPlaceData && data && getPlaceData(data[0])
            setPage(1)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }

    //처음 데이터 받아오기
    useEffect(() => {
        fetchData() // fetchData 함수를 실행하여 초기 데이터를 가져옴
    }, [pno]) // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

    //스크롤 조회
    async function onInfinityReportList() {
        try {
            const data = await getPlaceDetailsInfo(
                Number(pno), //페이지
                page, //
                isAd //
            )
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (!data || data.length === 0) {
                observer.disconnect()
                boardData !== null && setBoardRequest(false)
                return
            }
            data && boardData !== null && setBoardData([...boardData, ...data])
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            boardRequest === true && onInfinityReportList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (boardRef.current) {
            observer.observe(boardRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (boardRef.current) {
                observer.unobserve(boardRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [boardData, boardRequest, boardRef])

    return (
        <BoardBox className="relative">
            {loading && <LoadingSppinnerSmall />}
            {boardData && boardData?.length > 1 ? (
                boardData.map(
                    (data: PlaceBoardData, index) =>
                        data.writer !== null && (
                            <Board key={index} placeBoardData={data} />
                        )
                )
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    <p className="text-xl font-bold">게시글이 없습니다...</p>
                </div>
            )}
            {boardData?.length !== 1 &&
                (boardRequest === true ? (
                    <div className="my-5" ref={boardRef}>
                        <MiniSppinner />
                    </div>
                ) : (
                    <div className="my-5">•</div>
                ))}
        </BoardBox>
    )
}

export default PlaceDetailsItem
