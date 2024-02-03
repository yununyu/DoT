import {useState} from 'react'
import {
    Box,
    SearchInput,
    BoardToggle,
    Subtitle,
    Button,
    Title
} from '../../components/index'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useSearchParams} from 'react-router-dom'
import {faSignsPost} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import CourseSearchItem from '../../components/course/CourseSearchItem'

export const CourseSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const initialSearch = searchParams.get('search') || ''

    const navigate = useNavigate()

    const user = useSelector((state: RootState) => state.login.mno)!

    const handleRegisterClick = () => {
        navigate(`/board/course/posting/register`)
    }

    //검색 값
    const [searchValue, setSearchValue] = useState<string>(initialSearch)

    //입력때마다 검색값 업데이트
    function onChangeSearch(value: string) {
        setSearchValue(value)
    }

    async function onCourseList(
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
            setSearchParams({search: searchValue})
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Box>
            <div className="w-1/2">
                <Title className="mb-5 text-darkGreen">코스 게시판</Title>
                <div className="flex w-full mb-5">
                    <div className="flex w-full">
                        <SearchInput
                            className="w-4/5 ml-0"
                            value={searchValue}
                            onChange={onChangeSearch}
                            onKeyDown={onCourseList}
                            placeholder="코스 검색"
                        />
                        <Button
                            onClick={onCourseList}
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
                <BoardToggle>
                    <Subtitle
                        value="유저"
                        className="flex flex-row-reverse items-center text-left">
                        <FontAwesomeIcon icon={faSignsPost} className="m-1" />
                    </Subtitle>
                    <Subtitle
                        value="광고"
                        className="flex flex-row-reverse items-center text-left">
                        <FontAwesomeIcon icon={faSignsPost} className="m-1" />
                    </Subtitle>
                    <CourseSearchItem
                        isAd={false}
                        searchValue={searchParams.get('search') || ''}
                    />
                    <CourseSearchItem
                        isAd={true}
                        searchValue={searchParams.get('search') || ''}
                    />
                </BoardToggle>
            </div>
        </Box>
    )
}
