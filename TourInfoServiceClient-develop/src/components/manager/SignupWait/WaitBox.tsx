import {FC, useEffect, useRef, useState} from 'react'
import {
    LoadingSppinnerSmall,
    MiniSppinner,
    SubBox,
    Subtitle,
    UserInfoItemBox,
    WaitUser
} from '../../index'
import {SignupWaitData} from '../../../data/User/User'
import {getSignupWait} from '../../../api/Manager/Manager'
import {useSelector} from 'react-redux'
import {RootState} from '../../../store/rootReducer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faList} from '@fortawesome/free-solid-svg-icons'
import {useDispatch} from 'react-redux'

//회원 대기 목록 컴포넌트 합체 - 추후 WaitUser에 props 추가하여야하고 반복문으로 수정해야함

type WaitBoxProps = {}

export const WaitBox: FC<WaitBoxProps> = ({}) => {
    const waitRef = useRef(null) // 관찰할 요소에 대한 참조
    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(0)
    const [waitRequest, setWaitRequest] = useState<boolean>(true)
    const [waitData, setWaitData] = useState<SignupWaitData[] | null>(null)
    const userCheck = useSelector((state: RootState) => state.manager.isDone)

    const [loading, setLoading] = useState<Boolean>(false)

    //회원 대기 조회
    async function onSignupWaitList() {
        setLoading(true)
        try {
            const data = await getSignupWait(0)
            setWaitData(data)
            setLoading(false)
            setPage(1)
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }
    useEffect(() => {
        onSignupWaitList()
    }, [userCheck])

    //스크롤 조회
    async function onInfinityReportList() {
        try {
            const data = await getSignupWait(page)
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.length === 0) {
                observer.disconnect()
                waitData !== null && setWaitRequest(false)
                return
            }
            waitData !== null && setWaitData([...waitData, ...data])
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            waitRequest === true && onInfinityReportList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (waitRef.current) {
            observer.observe(waitRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (waitRef.current) {
                observer.unobserve(waitRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [waitData, waitRequest, waitRef])

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-2/3 ml-4">
                <div className="flex items-center m-5">
                    <FontAwesomeIcon icon={faList} className="m-1" />
                    <Subtitle
                        value="회원대기 목록"
                        className="flex items-center w-full"
                    />
                </div>
            </div>
            <SubBox className="relative">
                <UserInfoItemBox widthFull={false}>
                    <div className="flex">
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">회원번호</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">이름</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">이메일</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">
                                사업자 번호
                            </Subtitle>
                        </div>
                    </div>
                </UserInfoItemBox>

                {loading && <LoadingSppinnerSmall />}

                {waitData &&
                    waitData.map((waitUser, index) => (
                        <WaitUser key={index} waitUser={waitUser} />
                    ))}
                {waitData?.length === 0 ? (
                    <p className="mt-4 text-lg">검색 결과가 존재하지 않습니다...</p>
                ) : (
                    ''
                )}
                {waitData?.length !== 0 &&
                    (waitRequest === true ? (
                        <div className="my-5" ref={waitRef}>
                            <MiniSppinner />
                        </div>
                    ) : (
                        <div className="my-5">•</div>
                    ))}
            </SubBox>
        </div>
    )
}
