import {useState, useEffect, FC, useMemo} from 'react'
import {userBoard} from './../../../data/User/User'
import {ShowUserBoard} from './../../../api/MyPage/ShowUserInfo'
import {useNavigate} from 'react-router-dom'

type MyPostBoxProps = {
    mno: number
}

export const MyPostBox: FC<MyPostBoxProps> = ({mno}) => {
    const [boardList, setBoardList] = useState<userBoard>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userBoardData = await ShowUserBoard(mno)
                setBoardList(userBoardData)
            } catch {
                console.error('error')
            }
        }
        fetchData()
    }, [mno])

    return (
        <div>
            <table className="w-full table-auto">
                <thead className="justify-between">
                    <tr className="border-b ">
                        <th className="px-20 border-r ">글번호</th>
                        <th className="px-20 border-r ">제목</th>
                        <th className="px-20 border-r ">작성자</th>
                        <th className="px-20">작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(boardList) &&
                        boardList.map((board: userBoard) => (
                            <tr>
                                <td>
                                    <label
                                        onClick={() =>
                                            navigate(
                                                `/board/place/posting?bno=${board.bno}`
                                            )
                                        }
                                        className="cursor-pointer hover:underline">
                                        {board.bno}
                                    </label>
                                </td>
                                <td>
                                    <span
                                        onClick={() =>
                                            navigate(
                                                `/board/place/posting?bno=${board.bno}`
                                            )
                                        }
                                        className="cursor-pointer hover:underline">
                                        {board.title}
                                    </span>
                                </td>
                                <td>{board.writer}</td>
                                <td>{board.regdate.slice(0,10)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {!boardList && (
                <div className="py-8">
                    <p>작성글이 없습니다.</p>
                </div>
            )}
        </div>
    )
}
