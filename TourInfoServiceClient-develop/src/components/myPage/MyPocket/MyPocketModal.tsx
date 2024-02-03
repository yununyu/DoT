import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPlus, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import React, {useState, FC, ChangeEvent, useRef} from 'react'
import {
    Button,
    Box,
    SearchInput,
    SearchInfo,
    SearchMap,
    ChooseMap,
    Input,
    SearchMapRef
} from './../../index'
import {PlaceData} from './../../../data/placeSearch'
import {spotAddData} from './../../../data/Folder/Folder'
import {registerPlace, appendCart} from './../../../api/index'
import {getSearchPlaceInfo} from './../../../api'
import {RootState} from './../../../store/rootReducer'
import {useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'

//TODO -  category가 sight일때 등록안되는 오류

type MyPocketModalProps = {
    selectedComponent?: number
    onClose?: () => void
    className?: string
}

export const MyPocketModal: FC<MyPocketModalProps> = ({
    selectedComponent,
    onClose,
    className
}) => {
    //검색 값
    const [searchValue, setSearchValue] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [placeInfoData, setPlaceInfoData] = useState<PlaceData[] | null>(null)
    const searchMapRef = useRef<SearchMapRef | null>(null)

    const [spotModal, setSpotModal] = useState(false)
    const [registerSpotModal, setRegisterSpotModal] = useState(false)

    // 장소 등록을 위한 값
    const [placeName, setPlaceName] = useState<string>('')
    const [placeRoad, setPlaceRoad] = useState<string>('')
    const [placeLocal, setPlaceLocal] = useState<string>('')
    const [placeEng, setPlaceEng] = useState<string>('')
    const [placeLng, setPlaceLng] = useState<number>(0)
    const [placeLat, setPlaceLat] = useState<number>(0)

    //스팟 등록을 위한 값
    const [selectedSpotCategory, setSelectedSpotCategory] = useState<string>('SIGHT')

    const {mno} = useParams()
    const userMno = useSelector((state: RootState) => state.login.mno) || 0

    const openSpotModal = () => {
        setSpotModal(true)
    }

    const closeSpotModal = () => {
        setSpotModal(false)
        setSearchValue('')
        setPlaceInfoData([])
        onClose && onClose()
    }

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
            if (!(placeName && placeLng !== 0 && (placeLocal !== '' || placeRoad !== '')))
                throw new Error('장소 이름과 장소를 선택해주세요')

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
            setPlaceName('')
            setPlaceLng(0)
            closeRegisterSpotModal()
        } catch (err) {
            console.log(err)
            alert(err)
        }
    }

    //입력때마다 검색값 업데이트
    function onChangeSearch(value: string) {
        setSearchValue(value)
    }

    function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedCategory(e.target.value)
    }

    function handleSpotCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedSpotCategory(e.target.value)
    }

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

        try {
            const data = await getSearchPlaceInfo(selectedCategory, searchValue, 0)
            setPlaceInfoData(data)
        } catch (err) {
            console.log(err)
            alert('서버와 연결이 끊겼습니다.')
        }
    }

    return (
        <div>
            <button
                onClick={openSpotModal}
                className={`w-32 h-12 text-black bg-gray-400 rounded-xl ${className}`}>
                스팟 추가
            </button>

            {spotModal ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-500 bg-opacity-75">
                    <div className="w-4/5 p-8 bg-white rounded shadow-lg h-5/6">
                        <div className="flex ">
                            <div className="w-1/8">
                                <button onClick={closeSpotModal}>
                                    <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="w-12 h-12"
                                    />
                                </button>
                            </div>
                            <select
                                className="w-20 border border-gray-300 ml-60 rounded-xl"
                                value={selectedCategory}
                                onChange={handleCategoryChange}>
                                <option value="">전체</option>
                                <option value="SIGHT">관광지</option>
                                <option value="RESTAURANT">음식점</option>
                                <option value="LODGMENT">숙소</option>
                                <option value="ETC">기타</option>
                            </select>
                            <SearchInput
                                className="w-2/5 ml-1"
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
                            {/* <RegisterPlace /> */}
                        </div>
                        <Box className="w-4/5 overflow-hidden bg-white h-4/5">
                            <div className="flex justify-center w-full h-full ">
                                <div className="flex w-full h-full">
                                    {/* <div className="z-0 w-1/3 overflow-y-auto border rounded-lg border--300"> */}
                                    <div className="w-1/3 mr-2 overflow-y-auto border rounded-lg border--300">
                                        {/* 검색 결과를 보여줄 컴포넌트 */}
                                        {placeInfoData &&
                                            placeInfoData.map(
                                                (data: PlaceData, index) => (
                                                    <SearchInfo
                                                        placeInfoData={data}
                                                        mapClick={() => onMap(index)}
                                                    />
                                                )
                                            )}
                                        <button
                                            onClick={openRegisterSpotModal}
                                            className="flex justify-center w-full h-40 mt-8 hover:cursor-pointer">
                                            <FontAwesomeIcon
                                                icon={faPlus}
                                                className="w-20 h-40"
                                            />
                                        </button>
                                    </div>

                                    {/* 장소등록 모달 */}
                                    <div>
                                        {registerSpotModal ? (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                                                <div className="w-4/5 p-8 bg-white rounded shadow-lg h-6/7">
                                                    <div className="flex bg-white">
                                                        <div className="flex justify-between w-full mb-8 ">
                                                            <button
                                                                className="mr-12"
                                                                onClick={
                                                                    closeRegisterSpotModal
                                                                }>
                                                                <FontAwesomeIcon
                                                                    icon={faArrowLeft}
                                                                    className="w-12 h-12 cursor-pointer "
                                                                />
                                                            </button>
                                                            <span className="w-24 mr-4 text-3xl">
                                                                주소
                                                            </span>
                                                            <Input
                                                                className="w-1/2 h-12 mr-8"
                                                                value={placeLocal}
                                                            />
                                                            <span className="w-48 mr-4 text-3xl">
                                                                장소 제목
                                                            </span>
                                                            <Input
                                                                className="w-1/3 mr-8"
                                                                onChange={
                                                                    onChangePlaceName
                                                                }
                                                            />
                                                            <select
                                                                className="w-20 border border-gray-300 rounded-xl"
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

                                                            <Button
                                                                value="등록하기"
                                                                className="h-12 ml-4"
                                                                onClick={() => {
                                                                    onRegisterPlace()
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="">
                                                        <ChooseMap
                                                            onRoadAddressChange={
                                                                setPlaceRoad
                                                            }
                                                            onLocalAddressChange={
                                                                setPlaceLocal
                                                            }
                                                            onEngAddressChange={
                                                                setPlaceEng
                                                            }
                                                            onLngChange={setPlaceLng}
                                                            onLatChange={setPlaceLat}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                        </Box>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
