import {useState, useEffect, FC} from 'react'
import {userCourse} from './../../../data/User/User'
import {ShowUserCourse} from './../../../api/MyPage/ShowUserInfo'
import {useNavigate} from 'react-router-dom'

type MyCourseBoxProps = {
    mno: number
}

export const MyCourseBox: FC<MyCourseBoxProps> = ({mno}) => {
    const [courseList, setCourseList] = useState<userCourse>()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCourseData = await ShowUserCourse(mno)
                setCourseList(userCourseData)
            } catch {
                console.error('error')
            }
        }
        fetchData()
    }, [mno])

    return (
        <div>
            <table className="table-fixed ">
                <thead className="justify-between">
                    <tr className="border-b">
                        <th className="px-20 border-r ">글번호</th>
                        <th className="px-20 border-r">제목</th>
                        <th className="px-20 border-r">작성자</th>
                        <th className="px-20 ">작성일자</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(courseList) &&
                        courseList.map((course: userCourse) => (
                            <tr className="">
                                <td className="">
                                    <span
                                        onClick={() =>
                                            navigate(
                                                `/board/course/posting?bno=${course.bno}`
                                            )
                                        }
                                        className="cursor-pointer hover:underline">
                                        {course.bno}
                                    </span>
                                </td>
                                <td className="">
                                    <span
                                        onClick={() =>
                                            navigate(
                                                `/board/course/posting?bno=${course.bno}`
                                            )
                                        }
                                        className="cursor-pointer hover:underline ">
                                        {course.title}
                                    </span>
                                </td>
                                <td className="">{course.writer}</td>
                                <td className="">{course.regdate.slice(0,10)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {!courseList && (
                <div className="py-8">
                    <p>작성글이 없습니다.</p>
                </div>
            )}
        </div>
    )
}
