import {FC, PropsWithChildren, useEffect, useMemo, useRef, useState} from 'react'
import {
    TextEditor,
    Input,
    Button,
    Rating,
    RatingRef,
    EditorRef,
    MainSlider,
    CoursePostMap
} from '../../components'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {
    coursePostLoad,
    deleteBoard,
    modifyCourseBoard,
    registCourseBoard
} from '../../api/Board/board'
import {useDispatch} from 'react-redux'
import {addDay, deleteAll, setCommonState} from '../../store/slices/CourseSlice'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {CourseList} from '../../components/course/CourseRegist/CourseList'
import {saveCourseBoardDTO} from '../../data/Board/BoardData'
import noImage from '../../assets/smallLogo.png'
import {SwiperSlide} from 'swiper/react'

type CourseRegisterProps = {
    isModify: boolean // true: 수정, false: 등록
}

export const CourseRegister: FC<PropsWithChildren<CourseRegisterProps>> = props => {
    const day = useSelector((state: RootState) => state.course)

    const dispatch = useDispatch()

    // plus day box
    function daysPlus() {
        dispatch(addDay())
    }

    const navigate = useNavigate()
    // left arrow button
    function backPage() {
        // 뒤로가기 로직
        navigate(-1)
    }

    // 자식 ref
    const titleRef = useRef<HTMLInputElement | null>(null)
    const starRef = useRef<RatingRef | null>(null)
    const editorRef = useRef<EditorRef | null>(null)
    const user = useSelector((state: RootState) => state.login.mno)!
    const course = useSelector((state: RootState) => state.course)!

    const [loadImg, setLoadImg] = useState<string[]>([])

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

        // editor로 인해 upload 된 images
        const images = editorRef.current?.getImages || []
        const placeList = course.map(daliyPlace => daliyPlace.map(place => place.pno))
        ////
        const board: saveCourseBoardDTO = {
            bno: null,
            title: title,
            score: score,
            content: content,
            deleteImages: [],
            images: [],
            coursePlaceList: placeList,
            writer: user
        }
        ////

        registCourseBoard(board, images).then(res => {
            alert(`${res.bno}번 글 등록 완료!`)
            navigate(`/board/course/posting?bno=${res.bno}`)
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
        const placeList = course.map(daliyPlace => daliyPlace.map(place => place.pno))
        images.push(...loadImg.map(src => ({ino: -1, src: src})))

        console.log(images)

        ////
        const board: saveCourseBoardDTO = {
            bno: parseInt(searchParams.get('bno')!),
            title: title,
            score: score,
            content: content,
            deleteImages: [],
            images: [],
            coursePlaceList: placeList,
            writer: user
        }
        ////

        modifyCourseBoard(board, images).then(res => {
            alert(`${res.bno}번 글 수정 완료!`)
            navigate(`/board/course/posting?bno=${res.bno}`)
        })
    }
    // 삭제 onclick 함수
    async function erase() {
        const bno = searchParams.get('bno') || '0'
        try {
            deleteBoard(parseInt(bno))
            alert('삭제 성공')
            navigate('board/course')
        } catch (error) {
            alert('삭제 실패')
            navigate(-1)
        }
    }

    const [searchParams] = useSearchParams()
    // load page function
    async function loadPage() {
        const bno = searchParams.get('bno')!
        try {
            const data = await coursePostLoad(parseInt(bno), user != null)
            if (data.writerDTO.mno !== user) navigate('/unauthorized')
            if (!data.isCourse) {
                // 코스정보 에러 처리(front)
                throw new Error('Not Found')
            }
            if (titleRef.current) {
                titleRef.current.value = data.title
            }
            setLoadImg(data.images)
            editorRef.current?.getEditor()?.editor?.data.set(data.content)
            starRef.current?.setSelectedRating(data.score)

            console.log(data)
            dispatch(
                setCommonState(
                    data.postingPlaceBoardDTOS.map(dailyPlace =>
                        dailyPlace.map(place => ({
                            pno: place.pno,
                            pname: place.name,
                            img: noImage
                        }))
                    )
                )
            )
        } catch (error) {
            navigate('/notFound')
        }
    }

    useEffect(() => {
        if (!user) {
            alert('로그인 후 이용가능합니다.')
            navigate('/login')
            return
        }
        //새로 고침시 초기화
        dispatch(deleteAll())

        if (props.isModify) {
            loadPage()
        }
    }, [])

    const courseList = useMemo(() => <CourseList create={true} day={day} />, [day])

    return (
        <div className="w-full py-14">
            <div className="w-1/2 mx-auto">
                <div>
                    <div className="flex flex-row justify-between ">
                        <div>
                            <Button
                                className="flex items-center justify-center text-white bg-darkGreen "
                                value={'일정 +'}
                                onClick={daysPlus}
                            />
                        </div>
                        <div className="flex items-center">
                            <p className="mt-1 mr-3 text-xl font-bold text-orange-400">
                                별점을 선택하세요
                            </p>
                            <Rating ref={starRef} />
                        </div>
                    </div>
                    <Input
                        className="w-full my-2 border-2 border-darkGreen focus:border-darkGreen"
                        size={70}
                        placeholder="코스 게시글 제목을 입력하세요"
                        ref={titleRef}></Input>

                    <div>{courseList}</div>

                    <div>
                        <TextEditor ref={editorRef}></TextEditor>
                    </div>
                    <div className="flex flex-row justify-end my-2 ml-6">
                        {props.isModify && (
                            <Button
                                className="btn-error"
                                value={'삭제'}
                                onClick={erase}
                            />
                        )}
                        {props.isModify && (
                            <Button
                                className="btn-warning"
                                value={'수정'}
                                onClick={modify}
                            />
                        )}
                        {props.isModify || (
                            <Button
                                className="text-white bg-darkGreen"
                                value={'등록'}
                                onClick={regist}
                            />
                        )}
                        <Button
                            className="text-white bg-black"
                            onClick={backPage}
                            value={'취소'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
