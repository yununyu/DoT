import {FC, PropsWithChildren, useEffect, useRef, useState} from 'react'
import {
    Input,
    TextEditor,
    Button,
    Rating,
    InputPlace,
    PlacePostMap,
    Modal
} from '../../components'
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import type {RatingRef, EditorRef, PlaceProps, PnoName} from '../../components'
import {
    deleteBoard,
    modifyPlaceBoard,
    placePostLoad,
    registPlaceBoard
} from '../../api/Board/board'
import {savePlaceBoardDTO} from '../../data/Board/BoardData'
import {RootState} from '../../store/rootReducer'
import {useSelector} from 'react-redux'

type PostRegisterProps = {
    isModify: boolean // true: 수정, false: 등록,
}

// 장소 포스팅 등록
export const PostRegister: FC<PropsWithChildren<PostRegisterProps>> = props => {
    const navigate = useNavigate()
    const location = useLocation()

    const clearPlace = location.state?.clearPlace

    //모달 상태값 닫기/열기
    const [modalView, setModalView] = useState<boolean>(false)
    const [placeData, setPlaceData] = useState<PnoName | null>(
        clearPlace ? clearPlace : null
    )

    // 자식 ref
    const titleRef = useRef<HTMLInputElement | null>(null)
    const starRef = useRef<RatingRef | null>(null)
    const editorRef = useRef<EditorRef | null>(null)
    const user = useSelector((state: RootState) => state.login.mno)!

    const [loadImg, setLoadImg] = useState<string[]>([])

    //
    const [place, setPlace] = useState<PlaceProps>({
        name: '장소를 선택해주세요',
        lat: 35.1584,
        lng: 129.0583,
        roadAddress: '',
        localAddress: '',
        engAddress: ''
    })
    //
    const [loadPlace, setLoadPlace] = useState<PlaceProps>({
        name: '서면 거리',
        lat: 35.1584,
        lng: 129.0583,
        roadAddress: '부산광역시 서구 중앙대로 678',
        localAddress: '부산광역시 서구 서면',
        engAddress: '678, Jungang-daero, Seo-gu, Busan'
    })

    //취소
    function goBack() {
        navigate(-1)
    }

    //모달 열기
    function onOpenModal() {
        setModalView(true)
    }

    //모달 닫기
    function onCloseModal() {
        setModalView(false)
    }

    function getPlaceData(place: PlaceProps) {
        setPlace(place)
    }

    // 등록 onclick 함수
    function regist() {
        const title = titleRef.current?.value as string
        if (title == '') {
            alert('제목을 입력하세요')
            return
        }
        const score = starRef.current?.getSelectedRating() as number
        const content = editorRef.current?.getEditor()?.editor?.data.get() as string
        if (content == '') {
            alert('내용을 입력하세요')
            return
        }

        const place = placeData?.getPno as number
        if (place < 1 || place == null) {
            alert('장소를 입력하세요')
            return
        }

        // editor로 인해 upload 된 images
        const images = editorRef.current?.getImages || []

        ////
        const board: savePlaceBoardDTO = {
            bno: null,
            title: title,
            score: score,
            content: content,
            deleteImages: [],
            images: [],
            place: place,
            writer: user
        }
        ////

        registPlaceBoard(board, images).then(res => {
            alert(`${res.bno}번 글 등록 완료!`)
            navigate(`/board/place/posting?bno=${res.bno}`)
        })
    }
    // 수정 onclick 함수
    function modify() {
        const title = titleRef.current?.value as string
        if (title == '') {
            alert('제목을 입력하세요')
            return
        }
        const score = starRef.current?.getSelectedRating() as number
        const content = editorRef.current?.getEditor()?.editor?.data.get() as string
        if (content == '') {
            alert('내용을 입력하세요')
            return
        }

        // editor로 인해 upload 된 images
        let images = editorRef.current?.getImages || []
        images.push(...loadImg.map(src => ({ino: -1, src: src})))

        ////
        const board: savePlaceBoardDTO = {
            bno: parseInt(searchParams.get('bno')!),
            title: title,
            score: score,
            content: content,
            deleteImages: [],
            images: [],
            place: 0,
            writer: user
        }
        ////
        console.log(user)

        modifyPlaceBoard(board, images).then(res => {
            alert(`${res.bno}번 글 수정 완료!`)
            navigate(`/board/place/posting?bno=${res.bno}`)
        })
    }
    // 삭제 onclick 함수
    async function erase() {
        const bno = searchParams.get('bno') || '0'
        try {
            deleteBoard(parseInt(bno))
            alert('삭제 성공')
            navigate('/board/place')
        } catch (error) {
            alert('삭제 실패')
            navigate(-1)
        }
    }

    const [searchParams] = useSearchParams()
    useEffect(() => {
        if (!user) {
            alert('로그인 후 이용가능합니다.')
            navigate('/login')
        }
        if (props.isModify) {
            loadPage()
        }
    }, [])

    // load page function
    async function loadPage() {
        const bno = searchParams.get('bno')!
        try {
            const data = await placePostLoad(parseInt(bno), user != null)
            if (data.writerDTO.mno !== user) navigate('/unauthorized')
            if (data.isCourse) {
                // 코스정보 에러 처리(front)
                throw new Error('Not Found')
            }
            if (titleRef.current) {
                titleRef.current.value = data.title
            }
            setLoadImg(data.images)
            editorRef.current?.getEditor()?.editor?.data.set(data.content)
            starRef.current?.setSelectedRating(data.score)
            setLoadPlace({
                name: data.postingPlaceBoardDTOS[0][0].name,
                lat: data.postingPlaceBoardDTOS[0][0].lat,
                lng: data.postingPlaceBoardDTOS[0][0].lng,
                roadAddress: data.postingPlaceBoardDTOS[0][0].roadAddress,
                localAddress: data.postingPlaceBoardDTOS[0][0].localAddress,
                engAddress: data.postingPlaceBoardDTOS[0][0].engAddress
            })
        } catch (error) {
            navigate('/notFound')
        }
    }

    return (
        <div className="w-1/2 mx-auto mt-10">
            <div className="flex items-center justify-between w-full">
                {!props.isModify ? (
                    <div className="flex items-center">
                        <Button
                            className="mr-3 text-white bg-darkGreen"
                            onClick={onOpenModal}
                            value={'장소 선택'}
                        />
                        <p className="text-xl font-semibold text-darkGreen">
                            {place.name}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <p className="text-xl font-semibold text-darkGreen">
                            {loadPlace.name}
                        </p>
                    </div>
                )}

                <div className="flex items-center">
                    <p className="mt-1 mr-3 text-xl font-bold text-orange-400">
                        별점을 선택하세요
                    </p>
                    <Rating ref={starRef} />
                </div>
            </div>
            <Input
                className="w-full my-2 border-2 outline-none border-lightGreen focus:outline-none focus:border-lightGreen"
                size={70}
                placeholder="장소 게시글 제목을 입력하세요"
                ref={titleRef}></Input>
            <div>
                {!props.isModify && modalView && (
                    <Modal isOpen onClose={onCloseModal} className="w-full">
                        <InputPlace
                            className="w-full"
                            getPlaceData={getPlaceData}
                            onClose={onCloseModal}
                        />
                    </Modal>
                )}
                {props.isModify ? (
                    <PlacePostMap place={loadPlace!}></PlacePostMap>
                ) : (
                    <PlacePostMap
                        className="w-full border-0 shadow-xl rounded-3xl my-5"
                        place={place}></PlacePostMap>
                )}
            </div>

            <div>
                <TextEditor ref={editorRef}></TextEditor>
            </div>
            <div className="flex flex-row justify-end my-2 ml-6">
                {props.isModify && (
                    <Button className="btn-error" value={'삭제'} onClick={erase} />
                )}
                {props.isModify && (
                    <Button className="btn-warning" value={'수정'} onClick={modify} />
                )}
                {props.isModify || (
                    <Button
                        className="text-white bg-darkGreen"
                        value={'등록'}
                        onClick={regist}
                    />
                )}
                <Button className="text-white bg-black" onClick={goBack} value={'취소'} />
            </div>
        </div>
    )
}
