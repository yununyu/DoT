import {FC, useEffect, useRef, useState} from 'react'
import {
    Button,
    DropdownSelect,
    LoadingSppinnerSmall,
    MiniSppinner,
    ReportInfo,
    SearchInput,
    SubBox,
    Subtitle,
    UserInfoItemBox
} from '../../index'
import {ReportResponseData} from '../../../data/manager'
import {useSelector} from 'react-redux'
import {RootState} from '../../../store/rootReducer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBell} from '@fortawesome/free-solid-svg-icons'
import {setReportSearch} from '../../../store/slices/SearchSlice'
import {useDispatch} from 'react-redux'
import {getAllReport} from '../../../api'

//신고 박스

type ReportBoxProps = {}

export const ReportBox: FC<ReportBoxProps> = () => {
    const [page, setPage] = useState<number>(0)
    const [reportRequest, setReportRequest] = useState<boolean>(true)

    const loaderRef = useRef(null) // 관찰할 요소에 대한 참조
    const searchLoading = useSelector((state: RootState) => state.search.reportSearch)
    const dispatch = useDispatch()

    const [reportSelectValue, setReportSelectValue] = useState<string>('all')
    const [reportSearchValue, setReportSearchValue] = useState<string>('')

    //신고 검색 결과 데이터
    const [reportData, setReportData] = useState<ReportResponseData | null>(null)

    //새로고침에 필요한 값 불러오기
    const doneCheck = useSelector((state: RootState) => state.report.isDone)

    //신고 검색 input 입력때마다 검색값 업데이트
    function onChangeReportSearch(value: string) {
        setReportSearchValue(value)
    }

    //신고 검색 select 값 업데이트
    function onChangeReportSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setReportSelectValue(e.target.value)
    }

    //신고 조회(첫번째)
    async function onReportList(
        e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
    ) {
        //키보드로 입력이 들어왔는데 Enter가 아닌경우 return
        if (
            e?.type === 'keydown' &&
            (e as React.KeyboardEvent<HTMLInputElement>).key !== 'Enter'
        ) {
            return
        }
        setPage(1)
        setReportRequest(true)
        try {
            dispatch(setReportSearch(true))
            const data = await getAllReport(0, reportSelectValue, reportSearchValue)
            setReportData(data)
            dispatch(setReportSearch(false))
        } catch (err) {
            dispatch(setReportSearch(false))
            console.log(err)
        }
    }

    //처음 불러오는 데이터들
    useEffect(() => {
        onReportList()
    }, [doneCheck])

    //스크롤 조회
    async function onInfinityReportList() {
        try {
            const data: ReportResponseData = await getAllReport(
                page, //페이지 가격
                reportSelectValue, //
                reportSearchValue //
            )
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.data.length === 0) {
                observer.disconnect()
                reportData !== null && setReportRequest(false)
                return
            }
            reportData !== null &&
                setReportData({
                    result: data.result,
                    data: [...reportData.data, ...data.data]
                })
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            reportData?.result === true && onInfinityReportList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (loaderRef.current) {
            observer.observe(loaderRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [reportData, loaderRef])

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-2/3">
                <div className="flex items-center m-5 ">
                    <FontAwesomeIcon icon={faBell} className="m-1" />
                    <Subtitle value="신고 목록" className="flex items-center w-full">
                        <DropdownSelect>
                            <select
                                onChange={onChangeReportSelect}
                                value={reportSelectValue}
                                className="block w-full py-3 pl-3 pr-10 leading-tight border-2 shadow-lg appearance-none border-lightGreen rounded-2xl focus:outline-none focus:shadow-outline">
                                <option value="all">전체</option>
                                <option value="reporting">처리 중</option>
                                <option value="reported">처리 완료</option>
                                <option value="board_reporting">게시글 처리 중</option>
                                <option value="board_reported">게시글 처리 완료</option>
                                <option value="reply_reporting">댓글 처리 중</option>
                                <option value="reply_reported">댓글 처리 완료</option>
                            </select>
                        </DropdownSelect>
                        <SearchInput
                            className="w-1/2"
                            value={reportSearchValue}
                            onChange={onChangeReportSearch}
                            onKeyDown={onReportList}
                        />
                        <Button
                            onClick={onReportList}
                            value="검색"
                            className="text-center text-white shadow-lg bg-darkGreen"
                        />
                    </Subtitle>
                </div>
            </div>
            <SubBox className="relative">
                <UserInfoItemBox widthFull={true} justifyAround="justify-around">
                    <div className="flex justify-around w-full">
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">상태</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">신고날짜</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">
                                게시물 번호
                            </Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">
                                신고한 유저
                            </Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">신고 유저</Subtitle>
                        </div>
                    </div>
                </UserInfoItemBox>
                {searchLoading && <LoadingSppinnerSmall />}
                {reportData?.data.length !== 0 &&
                    reportData?.data.map((reportData, index) => (
                        <ReportInfo key={index} reportData={reportData} />
                    ))}
                {reportData?.data.length === 0 ? (
                    <p className="mt-4 text-lg">검색 결과가 존재하지 않습니다...</p>
                ) : (
                    ''
                )}
                {reportData?.data.length !== 0 &&
                    (reportRequest === true ? (
                        <div className="my-5" ref={loaderRef}>
                            <MiniSppinner />
                        </div>
                    ) : (
                        <div className="my-5">•</div>
                    ))}
            </SubBox>
        </div>
    )
}
