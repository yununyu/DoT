import {FC, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button, PlaceCartModal} from '../index'
import {PlaceData} from '../../data/placeSearch'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCartShopping, faCartPlus} from '@fortawesome/free-solid-svg-icons'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import noImage from '../../assets/smallLogo.png'

type SearchResultProps = {
    placeInfoData: PlaceData | null
    mapClick: () => void
    modal?: boolean
}

export const SearchInfo: FC<SearchResultProps> = ({placeInfoData, modal, ...props}) => {
    const navigate = useNavigate()
    const [modalView, setModalView] = useState<boolean>(false)

    //모달 열기
    const onOpenModal = () => {
        setModalView(true)
    }

    //모달 닫기
    const onCloseModal = () => {
        setModalView(false)
    }

    const user = useSelector((state: RootState) => state.login.mno)!

    const handleReviewClick = () => {
        if (placeInfoData && placeInfoData.pno) {
            // 예상되는 pno 데이터가 있다면
            const {pno} = placeInfoData
            navigate(`/board/place/${pno}`) // 해당 pno를 사용하여 동적 경로로 이동
        } else {
            console.error("No 'pno' data available")
        }
    }

    if (!placeInfoData) {
        // placeInfoData가 없을 때의 처리
        return <div>No data available</div>
    }

    return (
        <div
            className="flex flex-col p-2 mx-3 my-8 overflow-hidden duration-150 border rounded-lg cursor-pointer border-lightGreen hover:shadow-xl"
            onClick={props.mapClick}>
            <div className="relative flex justify-center w-full overflow-hidden h-36">
                <img
                    src={placeInfoData.image ?? noImage}
                    alt="Image"
                    className="flex h-full overflow-hidden duration-150 hover:scale-110"
                />
                {user && !modal && (
                    <label
                        className="absolute z-0 px-3 top-2 btn right-2"
                        onClick={onOpenModal}>
                        <FontAwesomeIcon icon={faCartPlus} className="text-lg " />
                    </label>
                )}
            </div>
            <div className="flex">
                <div>
                    {/* {user && <PlaceCartModal pno={placeInfoData.pno}/>} */}

                    {modalView && (
                        <PlaceCartModal
                            pno={placeInfoData.pno}
                            onCloseModal={onCloseModal}
                        />
                    )}
                </div>
                <div className="flex flex-col items-start w-full">
                    <div className="w-full px-3 py-2">
                        <div className="flex justify-between w-full">
                            <div>
                                <p className="text-lg font-bold">{placeInfoData.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {placeInfoData.category === 'SIGHT'
                                        ? '관광지'
                                        : placeInfoData.category === 'RESTAURANT'
                                        ? '음식점'
                                        : placeInfoData.category === 'LODGMENT'
                                        ? '숙소'
                                        : '기타'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between w-full">
                            <div>
                                <p className="text-left text-gray-500">
                                    {placeInfoData.roadAddress}
                                </p>
                            </div>
                            <p className="flex">
                                <FontAwesomeIcon icon={faCartShopping} className="mx-2" />
                                {placeInfoData.cart}
                            </p>
                        </div>
                    </div>
                    {!modal && (
                        <div className="flex justify-center w-full">
                            <Button
                                onClick={handleReviewClick}
                                className="w-full p-0 m-0 text-white bg-darkGreen"
                                value={'보러가기'}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
