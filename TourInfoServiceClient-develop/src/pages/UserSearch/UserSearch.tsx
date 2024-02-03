import {useEffect, useRef, useState} from 'react'
import {
    SearchInput,
    Button,
    SearchUserInfo,
    BoardBox,
    LoadingSppinnerSmall,
    Title,
    MiniSppinner
} from '../../components/index'
import {UserSearchData} from '../../data/User/User'
import {getSearchUserInfo} from '../../api/UserSearch/UserSearch'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {useSearchParams} from 'react-router-dom'
import {useDispatch} from 'react-redux'

export const UserSearch = () => {
    const userSearchRef = useRef(null) // 관찰할 요소에 대한 참조

    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(0)
    const [userRequest, setUserRequest] = useState<boolean>(true)

    const [searchParams, setSearchParams] = useSearchParams()
    const initialSearch = searchParams.get('search') || ''

    const [loading, setLoading] = useState<boolean>(false)

    //검색 값
    const [searchValue, setSearchValue] = useState<string>(initialSearch)

    // 검색 결과 데이터
    const [userInfoData, setUserInfoData] = useState<UserSearchData[] | null>(null)

    //입력때마다 검색값 업데이트
    function onChangeSearch(value: string) {
        setSearchValue(value)
    }

    const user = useSelector((state: RootState) => state.login.mno)!

    async function onUserList(
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
        setUserRequest(true)
        try {
            setLoading(true)
            setSearchParams({search: searchValue})
            const data = await getSearchUserInfo(searchValue, user || null, 0)
            setUserInfoData(data)
            setLoading(false)
        } catch (error) {
            // 오류 처리
            console.error(error)
        }
    }

    //처음 불러오는 데이터
    useEffect(() => {
        onUserList()
    }, [])

    //스크롤 조회
    async function onInfinityList() {
        try {
            const data = await getSearchUserInfo(searchValue, user || null, page)
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.length === 0) {
                observer.disconnect()
                userInfoData !== null && setUserRequest(false)
                return
            }
            userInfoData !== null && setUserInfoData([...userInfoData, ...data])
            setPage(page + 1)
        } catch (err) {
            console.log(err)
        }
    }

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            userRequest === true && onInfinityList()
        }
    })

    //스크롤 설정
    useEffect(() => {
        //무한 스크롤
        if (userSearchRef.current) {
            observer.observe(userSearchRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (userSearchRef.current) {
                observer.unobserve(userSearchRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [userInfoData, userRequest, userSearchRef])

    return (
        <div className="flex flex-col items-center justify-center w-full my-14">
            <Title className="mb-5 text-darkGreen">유저 검색</Title>

            <div className="w-1/2 ">
                <div className="flex justify-center w-full mb-10">
                    <SearchInput
                        placeholder="유저 검색 (이름으로 검색)"
                        className="w-full"
                        value={searchValue}
                        onChange={onChangeSearch}
                        onKeyDown={onUserList}
                    />
                    <Button
                        className="text-white bg-darkGreen"
                        value={'검색'}
                        onClick={onUserList}
                    />
                </div>
                <BoardBox className="relative">
                    {loading && <LoadingSppinnerSmall />}
                    {userInfoData ? (
                        userInfoData.map(
                            (data: UserSearchData, index) =>
                                !(data.mno == user) && (
                                    <SearchUserInfo userInfo={data} key={index} />
                                )
                        )
                    ) : (
                        <p className="flex items-center justify-center w-full h-full text-xl font-semibold">
                            검색 결과가 존재하지 않습니다...
                        </p>
                    )}
                    {userInfoData?.length !== 0 &&
                        (userRequest === true ? (
                            <div className="my-5" ref={userSearchRef}>
                                <MiniSppinner />
                            </div>
                        ) : (
                            <div className="my-5">•</div>
                        ))}
                </BoardBox>
            </div>
        </div>
    )
}
