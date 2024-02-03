import {FC, useState, useEffect} from 'react'
import {MyCourseBox, MyPostBox, MyReplyBox} from './../index'

// 마이페이지 작성 글 보기 버튼

type WritingButtonProps = {
    mno: number
}

export const WritingButton: FC<WritingButtonProps> = ({mno}) => {
    const [content, setContent] = useState(<MyPostBox mno={mno} />)
    const [toggle, setToggle] = useState('post')
    // 초기 상태는 작성 게시글 보기 형태

    const components: {[key: string]: JSX.Element} = {
        post: <MyPostBox mno={mno} />,
        course: <MyCourseBox mno={mno} />,
        reply: <MyReplyBox mno={mno} />
    }

    const onChangeContent = (type: string) => {
        setContent(components[type])
        setToggle(type)
    }

    useEffect(() => {
        onChangeContent('post')
    }, [mno])

    return (
        <div className="flex flex-col items-center justify-center w-[1200px] p-10 mb-20 overflow-y-auto shadow-2xl rounded-2xl">
            <div className="justify-center inline-block w-full ">
                <button
                    onClick={() => onChangeContent('post')}
                    className={`w-40 h-12  mb-8 border-2 rounded-md focus:outline-none focus:shadow-outline ${
                        toggle === 'post' ? 'btn-info text-black' : 'btn-ghost'
                    }`}>
                    작성 게시글
                </button>
                <button
                    onClick={() => onChangeContent('course')}
                    className={`w-40 h-12 border-2 rounded-md focus:outline-none focus:shadow-outline ${
                        toggle === 'course' ? 'btn-info text-black' : 'btn-ghost'
                    }`}>
                    여행 코스
                </button>
                <button
                    onClick={() => onChangeContent('reply')}
                    className={`w-40 h-12 border-2 rounded-md focus:outline-none focus:shadow-outline ${
                        toggle === 'reply' ? 'btn-info text-black' : 'btn-ghost'
                    }`}>
                    댓글 목록
                </button>
            </div>
            <div className="min-h-[100px]">
                <div className="flex justify-center ">{content}</div>
            </div>
        </div>
    )
}
