import {FC, PropsWithChildren, useEffect, useState} from 'react'
import {Caption} from '../Texts'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEllipsisVertical} from '@fortawesome/free-solid-svg-icons'
import {Button, DropdownIcon} from '../Button'
import {dropdownText} from "../../dummy data/sb's dummy"
import dummyImage from '../../assets/profileImage.jpeg'
import {replyData} from '../../data/Reply/Reply'
import {useSearchParams} from 'react-router-dom'
import {createReply, deleteReply, getChildreply, updateReply} from '../../api'
import {Input} from '../Input'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import ReplyReportModal from './ReplyReportModal'
import {ChildReply} from './ChildReply'
import {useNavigate} from 'react-router-dom'

type ParentReplyProps = {
    reply: replyData
    getReply: () => void
}

// 댓글 하나
export const ParentReply: FC<PropsWithChildren<ParentReplyProps>> = ({
    reply,
    getReply
}) => {
    const mno = useSelector((state: RootState) => state.login.mno)

    const navigate = useNavigate()

    //댓글 값
    const [replyValue, setReplyValue] = useState<string>('')
    //대댓글 보기 토글
    const [viewReply, setViewReply] = useState<Boolean>(false)
    //대댓글 값
    const [reReply, setRereply] = useState<replyData[] | null>(null)
    //대댓글 입력값
    const [reReplyValue, setRereplyValue] = useState<string>('')
    //...버튼 안의 값 받아오기
    const [dropdownValue, setDropdownValue] = useState<string>('')
    //댓글 수정
    const [updateView, setUpdateVeiw] = useState<Boolean>(false)
    //신고 모달
    const [reportModalView, setReportModalView] = useState<Boolean>(false)

    const [searchParams] = useSearchParams()
    const bno = searchParams.get('bno')

    //댓글 값 변경
    function onChangeReply(value: string) {
        setReplyValue(value)
    }

    //대댓글 보기
    function onOpenReply() {
        setViewReply(true)
    }
    //대댓글 닫기
    function onCloseReply() {
        setViewReply(false)
    }

    //대댓글 입력값 변경
    function onChangeRereply(e: string) {
        setRereplyValue(e)
    }

    //드롭다운 값 받아오기
    function onGetDropdownValue(value: string) {
        if (value === '댓글 달기') {
            setViewReply(true)
        } else if (value === '수정') {
            setUpdateVeiw(true)
        } else if (value === '삭제') {
            onDeleteReply()
        } else if (value === '신고') {
            onOpenModal()
        }
        setDropdownValue(value)
    }
    //수정 취소
    function onUpdateCancel() {
        setReplyValue(reply.text)
        setUpdateVeiw(false)
    }
    //댓글 수정
    async function onUpdateReply() {
        const data = mno && (await updateReply({rno: reply.rno, mno, text: replyValue}))
        setUpdateVeiw(false)
        alert('수정완료')
    }
    //댓글 삭제
    async function onDeleteReply() {
        const data = mno && (await deleteReply({rno: reply.rno, mno}))
        alert('삭제완료')
        setUpdateVeiw(false)
        getReply()
    }

    //대댓글 조회
    async function getRereply() {
        if (bno) {
            const data = await getChildreply(parseInt(bno), reply.rno)
            setRereply(data)
        }
    }

    //대댓글 등록
    async function registRereply() {
        if (bno && mno) {
            const data = await createReply({
                text: reReplyValue,
                bno: parseInt(bno),
                mno,
                parentRno: reply.rno
            })
            setRereplyValue('')
        }
        getRereply()
    }

    function onOpenModal() {
        setReportModalView(true)
    }

    function onCloseModal(value: Boolean) {
        setReportModalView(value)
    }

    useEffect(() => {
        setReplyValue(reply.text)
        getRereply()
    }, [reply])

    return (
        <div className="flex flex-col my-5">
            <div className="flex justify-center w-full mx-auto border-b border-lightGreen">
                <div className="flex flex-col items-center justify-center w-24">
                    <div>
                        <img
                            className="w-10 cursor-pointer"
                            alt="프로필 사진"
                            src={reply.src ? reply.src : dummyImage}
                            onClick={() => {
                                if (reply.mno !== null) {
                                    navigate(`/mypage/${reply.mno}`)
                                } else {
                                    alert('탈퇴한 회원입니다')
                                }
                            }}
                        />
                    </div>
                    <div
                        className="flex items-center cursor-pointer hover:underline"
                        onClick={() => {
                            if (reply.mno !== null) {
                                navigate(`/mypage/${reply.mno}`)
                            } else {
                                alert('탈퇴한 회원입니다')
                            }
                        }}>
                        {reply.name}
                    </div>
                </div>
                <div className="flex flex-col w-5/6">
                    <div className="flex justify-end mx-4 my-2">
                        {mno && reply.mno && (
                            <DropdownIcon
                                texts={dropdownText}
                                replyMno={reply.mno}
                                replyParent={reply.parent_rno}
                                onGetDropdownValue={onGetDropdownValue}>
                                <FontAwesomeIcon
                                    className="hover:cursor-pointer"
                                    icon={faEllipsisVertical}
                                    size="lg"
                                />
                            </DropdownIcon>
                        )}
                    </div>

                    <div className="flex items-center justify-start mx-6">
                        <Input
                            className="w-4/5 text-left border-black cursor-default focus:outline-none read-only:border-none"
                            readOnly={!updateView ? true : false}
                            value={replyValue}
                            onChange={e => onChangeReply(e.target.value)}
                        />
                        {updateView && (
                            <>
                                <Button
                                    value={'수정'}
                                    className="text-white bg-blue-500"
                                    onClick={onUpdateReply}
                                />
                                <Button
                                    value={'취소'}
                                    className="text-white bg-black"
                                    onClick={onUpdateCancel}
                                />
                            </>
                        )}
                    </div>
                    <div className="flex justify-end mx-4 my-2">
                        <Caption>작성일자: {reply.regDate.slice(0,10)}</Caption>
                    </div>
                </div>
            </div>
            {/* 대댓글이 있는경우 대댓글 조회 */}
            {reReply?.length !== 0 && !viewReply && (
                <p
                    className="mb-6 text-sm text-green-800 duration-100 cursor-pointer hover:font-bold "
                    onClick={onOpenReply}>
                    대댓글 보기
                </p>
            )}
            {/* 대댓글이 있는경우 조회 */}
            {reReply &&
                reReply.map(reply => (
                    <ChildReply
                        viewReply={viewReply}
                        key={reply.rno}
                        reReplyData={reply}
                        getRereply={() => getRereply()}
                    />
                ))}

            {/* 로그인 하였고 댓글 달기 클릭 시 나타남 */}
            {mno && viewReply && (
                <div className="flex flex-row items-center justify-center my-5">
                    <Input
                        placeholder="대댓글을 작성해 주세요"
                        className="mx-2 focus:shadow-lg outline-darkGreen border-darkGreen focus:outline-none focus:border-darkGreen"
                        size={80}
                        value={reReplyValue}
                        onChange={e => onChangeRereply(e.target.value)}></Input>
                    <Button
                        value="작성"
                        className="font-medium text-white bg-darkGreen"
                        onClick={registRereply}
                    />
                </div>
            )}

            {viewReply && (
                <p
                    className="mb-6 text-sm duration-100 cursor-pointer hover:font-bold"
                    onClick={onCloseReply}>
                    - 닫기 -
                </p>
            )}
            {reportModalView && (
                <ReplyReportModal replyData={reply} onCloseModal={onCloseModal} />
            )}
        </div>
    )
}
