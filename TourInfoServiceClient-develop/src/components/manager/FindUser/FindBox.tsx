import {FC, useEffect, useRef, useState} from 'react'
import {
    Button,
    DropdownSelect,
    FindUserInfo,
    LoadingSppinnerSmall,
    MiniSppinner,
    SearchInput,
    SubBox,
    Subtitle,
    UserInfoItemBox
} from '../../index'
import {ManagerSearchUserData} from '../../../data/User/User'
import {useSelector} from 'react-redux'
import {RootState} from '../../../store/rootReducer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import {useDispatch} from 'react-redux'
import {setManagerSearch} from '../../../store/slices/SearchSlice'
import {managerSearchUser} from '../../../api/Manager/Manager'

type FindBoxProps = {}

//유저 검색 박스

export const FindBox: FC<FindBoxProps> = () => {
    const userLoadRef = useRef(null) // 관찰할 요소에 대한 참조

    const dispatch = useDispatch()
    const [page, setPage] = useState<number>(0)
    const [userRequest, setUserRequest] = useState<boolean>(true)
    const searchLoading = useSelector((state: RootState) => state.search.managerSearch)
    const userCheck = useSelector((state: RootState) => state.manager.isDone)
    //검색 값
    const [selectValue, setSelectValue] = useState<string>('all')
    const [searchValue, setSearchValue] = useState<string>('')

    //유저 검색 결과 데이터
    const [userData, setUserData] = useState<ManagerSearchUserData[] | null>(null)

    //사용자 검색 input 입력때마다 검색값 업데이트
    function onChangeSearch(value: string) {
        setSearchValue(value)
    }
    //사용자 검색 select 값 업데이트
    function onChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectValue(e.target.value)
    }

    //사용자 검색
    async function onSearchUsers(
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
            dispatch(setManagerSearch(true))
            const data = await managerSearchUser(0, selectValue, searchValue)
            setUserData(data)
            dispatch(setManagerSearch(false))
        } catch (err) {
            console.log(err)
            dispatch(setManagerSearch(false))
        }
    }

    //처음 불러오는 데이터들
    useEffect(() => {
        onSearchUsers()
    }, [userCheck])

    //스크롤 조회
    async function onInfinityList() {
        try {
            const data = await managerSearchUser(
                page, //페이지
                selectValue, //
                searchValue //
            )
            //데이터를 받는것이 없으면 스크롤 할 시 요청 보내지 못하도록 state 변경
            if (data.length === 0) {
                observer.disconnect()
                userData !== null && setUserRequest(false)
                return
            }
            userData !== null && setUserData([...userData, ...data])
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
        if (userLoadRef.current) {
            observer.observe(userLoadRef.current) // loaderRef를 관찰 대상으로 등록
        }
        return () => {
            if (userLoadRef.current) {
                observer.unobserve(userLoadRef.current) // 컴포넌트 언마운트 시 관찰 취소
            }
        }
    }, [userData, userRequest, userLoadRef])

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-2/3 ">
                <div className="flex items-center m-5">
                    <FontAwesomeIcon icon={faUser} className="m-1" />
                    <Subtitle value="사용자 검색" className="flex items-center w-full">
                        <DropdownSelect>
                            <select
                                onChange={onChangeSelect}
                                value={selectValue}
                                className="block w-full py-3 pl-3 pr-10 leading-tight border-2 shadow-lg appearance-none border-lightGreen rounded-2xl focus:outline-none focus:shadow-outline">
                                <option value="all">전체</option>
                                <option value="normal">일반 유저</option>
                                <option value="business">사업자</option>
                                <option value="disciplinary">정지된 유저</option>
                            </select>
                        </DropdownSelect>
                        <SearchInput
                            className="w-1/2"
                            value={searchValue}
                            onChange={onChangeSearch}
                            onKeyDown={onSearchUsers}
                        />
                        <Button
                            onClick={onSearchUsers}
                            value="검색"
                            className="text-center text-white shadow-lg bg-darkGreen"
                        />
                    </Subtitle>
                </div>
            </div>
            <SubBox className="relative">
                <UserInfoItemBox widthFull={false}>
                    <div className="flex">
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">번호</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">이름</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">이메일</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">전화번호</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">가입일자</Subtitle>
                        </div>
                        <div>
                            <Subtitle className="w-40 p-3 min-w-fit">
                                사업자 여부
                            </Subtitle>
                        </div>
                    </div>
                </UserInfoItemBox>
                {searchLoading && <LoadingSppinnerSmall />}
                {userData?.map((users, index) => (
                    <FindUserInfo key={index} users={users} />
                ))}
                {userData?.length === 0 ? (
                    <p className="mt-4 text-lg">검색 결과가 존재하지 않습니다...</p>
                ) : (
                    ''
                )}
                {userData?.length !== 0 &&
                    (userRequest === true ? (
                        <div className="my-5" ref={userLoadRef}>
                            <MiniSppinner />
                        </div>
                    ) : (
                        <div className="my-5">•</div>
                    ))}
            </SubBox>
        </div>
    )
}
