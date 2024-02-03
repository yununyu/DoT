import React, {useEffect, useRef, useState} from 'react'
import {
    SearchInput,
    SearchInfo,
    SearchMap,
    Button,
    SearchMapRef,
    LoadingSppinnerSmall,
    Title,
    MiniSppinner
} from '../../components/index'
import {PlaceData} from '../../data/placeSearch'
import {getSearchPlaceInfo} from '../../api'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'

// 장소 검색 페이지

export const PlaceSearch = () => {
    const placeRef = useRef(null) // 관찰할 요소에 대한 참조

    const [page, setPage] = useState<number>(0)
    const [placeRequest, setPlaceRequest] = useState<boolean>(true)

    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState<Boolean>(false)

    // 새로고침에 필요한 값 불러오기
    const searchMapRef = useRef<SearchMapRef | null>(null)

    // URL 쿼리 파라미터에서 초기 값 설정
    const initialFilter = searchParams.get('filter') || ''
    const initialSearch = searchParams.get('search') || ''

    // 로컬 상태
    const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter)
    const [searchValue, setSearchValue] = useState<string>(initialSearch)
    const [placeInfoData, setPlaceInfoData] = useState<PlaceData[] | null>(null)

    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.login.mno)!

    function onMap(index: number) {
        searchMapRef.current?.setLocation(index)
    }

    // 입력때마다 검색값 업데이트
    function onChangeSearch(value: string) {
        setSearchValue(value)
    }

    //장소 검색 Category 값 업데이트
    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedCategory(e.target.value)
    }
    const handleRegisterClick = () => {
        navigate(`/board/place/posting/register`)
    }

    // 검색 파라미터 변경 시 URL 업데이트 및 데이터 들고오기
    async function onPlaceList(
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
        setPlaceRequest(true)

        try {
            setLoading(true)
            setSearchParams({filter: selectedCategory, search: searchValue})
            const data = await getSearchPlaceInfo(selectedCategory, searchValue, 0)
            setPlaceInfoData(data)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching data:', err)
            setLoading(false)
        }
    }

    useEffect(() => {
        onPlaceList()
    }, [])

    //스크롤 조회
    async function onInfinityList() {
        try {
            const data = await getSearchPlaceInfo(selectedCategory, searchValue, page)
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.length === 0) {
                observer.disconnect()
                placeInfoData !== null && setPlaceRequest(false)
                return
            }
            placeInfoData !== null && setPlaceInfoData([...placeInfoData, ...data])
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            placeRequest === true && onInfinityList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (placeRef.current) {
            observer.observe(placeRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (placeRef.current) {
                observer.unobserve(placeRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [placeInfoData, placeRequest, placeRef])

    return (
        <div className="flex flex-col items-center justify-center w-full py-0 mt-14">
            <Title className="mb-5 text-darkGreen">장소 게시판</Title>

            <div className="flex justify-center w-2/3">
                <div className="flex w-full">
                    <select
                        className="px-2 border-2 shadow-xl outline-none border-lightGreen rounded-2xl"
                        value={selectedCategory}
                        onChange={handleCategoryChange}>
                        <option value="">전체</option>
                        <option value="SIGHT">관광지</option>
                        <option value="RESTAURANT">음식점</option>
                        <option value="LODGMENT">숙소</option>
                        <option value="ETC">기타</option>
                    </select>
                    <SearchInput
                        className="w-4/5 m-0"
                        value={searchValue}
                        onChange={onChangeSearch}
                        onKeyDown={onPlaceList}
                        placeholder="장소 검색"
                    />
                    <Button
                        onClick={onPlaceList}
                        className="text-white shadow-xl bg-darkGreen"
                        value={'검색'}
                    />
                </div>
                {user && (
                    <Button
                        onClick={handleRegisterClick}
                        className="text-white shadow-xl bg-lightGreen"
                        value={'게시글 작성'}
                    />
                )}
            </div>

            <div className="flex justify-center w-full h-screen py-5 mb-12 overflow-hidden">
                <div className="relative flex w-2/3 h-full ">
                    {loading && <LoadingSppinnerSmall />}
                    <div className="w-1/3 overflow-y-auto border rounded-lg border-300 border-lightGreen">
                        {/* 검색 결과를 보여줄 컴포넌트 */}
                        {placeInfoData && placeInfoData.length > 0 ? (
                            placeInfoData.map((data: PlaceData, index) => (
                                <SearchInfo
                                    key={index}
                                    placeInfoData={data}
                                    mapClick={() => onMap(index)}
                                />
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full ">
                                <p className="text-lg font-semibold">
                                    검색 결과가 없습니다...
                                </p>
                            </div>
                        )}
                        {placeInfoData?.length !== 0 &&
                            (placeRequest === true ? (
                                <div className="my-5" ref={placeRef}>
                                    <MiniSppinner />
                                </div>
                            ) : (
                                <div className="my-5">•</div>
                            ))}
                    </div>
                    <div className="w-2/3 border rounded-lg border-lightGreen ">
                        {/* MapAPI 컴포넌트 */}
                        {placeInfoData ? (
                            <SearchMap
                                places={placeInfoData}
                                className="w-full h-full"
                                innerRef={searchMapRef}
                            />
                        ) : (
                            <SearchMap
                                places={null}
                                className="w-full h-full"
                                innerRef={searchMapRef}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
