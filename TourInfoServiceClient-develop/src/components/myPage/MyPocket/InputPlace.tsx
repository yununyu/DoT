import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {
    Button,
    SearchInput,
    SearchInfo,
    SearchMap,
    ChooseMap,
    Input,
    SearchMapRef,
    Title,
    Modal,
    PlaceProps,
    LoadingSppinnerSmall
} from './../../index'
import {PlaceData} from './../../../data/placeSearch'
import {registerPlace} from './../../../api/index'
import {getSearchPlaceInfo} from './../../../api'
import React, {
    useState,
    FC,
    ChangeEvent,
    useRef,
    forwardRef,
    useImperativeHandle,
    Ref,
    useEffect
} from 'react'
import {useDispatch} from 'react-redux'
import {addLastItem} from '../../../store/slices/CourseSlice'

// 컴포넌트 className 값
type InputPlaceProps = {
    className?: string
    ref?: Ref<PnoName>
    getPlaceData?: (place: PlaceProps) => void
    onClose?: () => void
    dayIndex?: number
}

export type PnoName = {
    getPno: number
    getPname?: string
}

export const InputPlace: FC<InputPlaceProps> = forwardRef<PnoName, InputPlaceProps>(
    ({className, getPlaceData, onClose, dayIndex}, ref) => {
        const [searchValue, setSearchValue] = useState<string>('')
        const [selectedCategory, setSelectedCategory] = useState<string>('') // 장소 검색할때 category
        const [placeInfoData, setPlaceInfoData] = useState<PlaceData[] | null>(null) // 장소 검색 결과
        const searchMapRef = useRef<SearchMapRef | null>(null)
        const [registerSpotModal, setRegisterSpotModal] = useState(false)

        const [loading, setLoading] = useState<boolean>(false)

        const placeInfoRef = useRef(null) // 관찰할 요소에 대한 참조

        const [page, setPage] = useState<number>(1)
        const [placeInfoRequest, setPlaceInfoRequest] = useState<boolean>(true)

        // 장소 등록을 위한 값
        const [placeName, setPlaceName] = useState<string>('')
        const [placeRoad, setPlaceRoad] = useState<string>('')
        const [placeLocal, setPlaceLocal] = useState<string>('')
        const [placeEng, setPlaceEng] = useState<string>('')
        const [placeLng, setPlaceLng] = useState<number>(0)
        const [placeLat, setPlaceLat] = useState<number>(0)
        const [selectedSpotCategory, setSelectedSpotCategory] = useState<string>('SIGHT') // 장소 등록할때 category

        const [pno, setPno] = useState<number>(0)

        //day 아이템 추가
        const dispatch = useDispatch()

        useImperativeHandle(ref, () => ({
            getPno: pno,
            getPname: ''
        }))

        // 장소 등록 모달
        const openRegisterSpotModal = () => {
            setRegisterSpotModal(true)
        }

        const closeRegisterSpotModal = () => {
            setRegisterSpotModal(false)
            setPlaceLocal('') // 모달창 닫으면 초기화
        }

        function onMap(index: number) {
            searchMapRef.current?.setLocation(index)
        }

        // 장소 이름
        const onChangePlaceName = (e: ChangeEvent<HTMLInputElement>) => {
            setPlaceName(e.target.value)
        }

        //장소 등록
        async function onRegisterPlace() {
            try {
                await registerPlace({
                    name: placeName,
                    lng: placeLng,
                    lat: placeLat,
                    roadAddress: placeRoad,
                    localAddress: placeLocal,
                    engAddress: placeEng,
                    category: selectedSpotCategory
                })
                alert('등록 완료')
            } catch (err) {
                console.log(err)
            }
        }

        //입력때마다 검색값 업데이트
        function onChangeSearch(value: string) {
            setSearchValue(value)
        }

        // 장소 검색 category
        function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
            setSelectedCategory(e.target.value)
        }

        // 장소 등록 category
        function handleSpotCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
            setSelectedSpotCategory(e.target.value)
        }

        function onCheckPlace(place: PlaceProps, img: string) {
            const con = window.confirm(`${place.name} 장소를 선택 하시겠습니까?`)
            if (con) {
                getPlaceData && getPlaceData(place)
                if (typeof dayIndex === 'number' && dayIndex >= 0) {
                    dispatch(
                        addLastItem({
                            index: dayIndex,
                            item: {pno: pno, pname: place.name, img: img}
                        })
                    )
                }
                onClose && onClose()
            }
        }

        async function onPlaceList(
            e?:
                | React.KeyboardEvent<HTMLInputElement>
                | React.MouseEvent<HTMLButtonElement>
        ) {
            //키보드로 입력이 들어왔는데 Enter가 아닌경우 return
            if (
                e?.type === 'keydown' &&
                (e as React.KeyboardEvent<HTMLInputElement>).key !== 'Enter'
            ) {
                return
            }
            setLoading(true)
            try {
                const data = await getSearchPlaceInfo(selectedCategory, searchValue, 0)
                setPlaceInfoData(data)
                setPage(1)
                setPlaceInfoRequest(true)
            } catch (err) {
                console.log(err)
                alert('서버와 연결이 끊겼습니다.')
            }
            setLoading(false)
        }

        //초기
        useEffect(() => {
            onPlaceList()
        }, [registerSpotModal])

        //스크롤 조회
        async function onInfinityList() {
            try {
                const data = await getSearchPlaceInfo(selectedCategory, searchValue, page)
                //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
                if (data.length === 0) {
                    observer.disconnect()
                    placeInfoData !== null && setPlaceInfoRequest(false)
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
                placeInfoRequest === true && onInfinityList()
            }
        })

        //스크롤 설정
        useEffect(() => {
            //무한 스크롤
            if (placeInfoRef.current) {
                observer.observe(placeInfoRef.current) // loaderRef를 관찰 대상으로 등록
            }
            return () => {
                if (placeInfoRef.current) {
                    observer.unobserve(placeInfoRef.current) // 컴포넌트 언마운트 시 관찰 취소
                }
            }
        }, [placeInfoData, placeInfoRequest, placeInfoRef])

        return (
            <div className={className}>
                <div className="w-full h-screen p-5 bg-white ">
                    <Title className="py-5">장소 선택</Title>
                    <div className="flex justify-center">
                        <select
                            className="px-3 border-2 border-lightGreen rounded-xl"
                            value={selectedCategory}
                            onChange={handleCategoryChange}>
                            <option value="">전체</option>
                            <option value="SIGHT">관광지</option>
                            <option value="RESTAURANT">음식점</option>
                            <option value="LODGMENT">숙소</option>
                            <option value="ETC">기타</option>
                        </select>
                        <SearchInput
                            placeholder="장소 검색"
                            className="w-full ml-1"
                            value={searchValue}
                            onChange={onChangeSearch}
                            onKeyDown={onPlaceList}
                        />
                        {/* 클릭시 들고오도록 수정 */}
                        <Button
                            onClick={onPlaceList}
                            className="text-white bg-darkGreen"
                            value={'검색'}
                        />

                        {/* 장소 등록하기 버튼 -> 모달창 */}
                    </div>
                    <div className="flex items-center justify-end w-full py-3">
                        <div
                            className="flex items-center hover:cursor-pointer"
                            onClick={openRegisterSpotModal}>
                            <p className="mr-1">장소 추가</p>
                            <FontAwesomeIcon icon={faPlus} />
                        </div>
                    </div>
                    <div className="relative flex flex-col items-center justify-center w-full overflow-hidden h-4/5">
                        {loading && <LoadingSppinnerSmall />}
                        <div className="flex justify-center w-full h-full ">
                            <div className="flex w-full h-full ">
                                {/* <div className="z-0 w-1/3 overflow-y-auto border rounded-lg border--300"> */}
                                <div className="w-1/3 mr-2 overflow-y-auto">
                                    {/* 검색 결과를 보여줄 컴포넌트 */}
                                    {placeInfoData && placeInfoData.length > 0 ? (
                                        placeInfoData.map((data: PlaceData, index) => (
                                            <SearchInfo
                                                key={index}
                                                modal={true}
                                                placeInfoData={data}
                                                mapClick={() => {
                                                    onMap(index)
                                                    setPno(data.pno)
                                                    onCheckPlace(data, data.image)
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <p className="text-lg font-semibold">
                                                검색결과가 존재하지 않습니다...
                                            </p>
                                        </div>
                                    )}
                                    {placeInfoData?.length !== 0 &&
                                        (placeInfoRequest === true ? (
                                            <div className="" ref={placeInfoRef}>
                                                로딩중 ...
                                            </div>
                                        ) : (
                                            <div>마지막 입니다.</div>
                                        ))}

                                    {/* 클릭시 장소등록 모달 열림, 장소등록 버튼 (수정하셔도 됩니다) */}
                                </div>

                                {/* 장소등록 모달 */}
                                <div>
                                    {registerSpotModal ? (
                                        <Modal isOpen onClose={closeRegisterSpotModal}>
                                            <div className="w-full h-full p-4">
                                                <Title>장소 추가</Title>
                                                <div className="flex bg-white">
                                                    <div className="flex items-center justify-between w-full mb-3 ">
                                                        {/* <div className="flex items-center">
                                                            <span className="w-24 ">
                                                                주소
                                                            </span>
                                                            <p className="w-full">
                                                                {placeLocal}
                                                            </p>
                                                        </div> */}
                                                        <div className="flex items-center w-full h-full">
                                                            <select
                                                                className="px-2 py-3 border-2 border-darkGreen rounded-xl"
                                                                value={
                                                                    selectedSpotCategory
                                                                }
                                                                onChange={
                                                                    handleSpotCategoryChange
                                                                }>
                                                                <option value="SIGHT">
                                                                    관광지
                                                                </option>
                                                                <option value="RESTAURANT">
                                                                    음식점
                                                                </option>
                                                                <option value="LODGMENT">
                                                                    숙소
                                                                </option>
                                                                <option value="ETC">
                                                                    기타
                                                                </option>
                                                            </select>
                                                            <div className="flex items-center ml-5">
                                                                <Input
                                                                    className="w-full border-2 border-darkGreen focus:border-darkGreen"
                                                                    placeholder="장소명 입력해주세요"
                                                                    onChange={
                                                                        onChangePlaceName
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        <Button
                                                            value="등록하기"
                                                            className="text-white bg-darkGreen"
                                                            onClick={() => {
                                                                onRegisterPlace()
                                                                closeRegisterSpotModal()
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <ChooseMap
                                                        onRoadAddressChange={setPlaceRoad}
                                                        onLocalAddressChange={
                                                            setPlaceLocal
                                                        }
                                                        onEngAddressChange={setPlaceEng}
                                                        onLngChange={setPlaceLng}
                                                        onLatChange={setPlaceLat}
                                                    />
                                                </div>
                                            </div>
                                        </Modal>
                                    ) : null}
                                </div>
                                <div className="w-4/6 border border-gray-300 rounded-lg">
                                    {!registerSpotModal &&
                                        (placeInfoData ? (
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
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)
