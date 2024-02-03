import {FC, useState} from 'react'
import {BoardData} from '../../data/Board/BoardData'
import {Button} from '../Button'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {reportReply} from '../../api'
import {Modal} from '../Modal'
import {reportBoard} from '../../api/Board/board'

type BoardReportModalProps = {
    boardData: BoardData
    onCloseModal: (value: Boolean) => void
}

const BoardReportModal: FC<BoardReportModalProps> = ({boardData, onCloseModal}) => {
    const mno = useSelector((state: RootState) => state.login.mno)

    const [isModalOpen, setModalOpen] = useState<boolean>(true)
    const [reportReason, setReportReason] = useState<string>('')
    const closeModal = () => {
        setModalOpen(false)
        onCloseModal(false)
    }
    //신고 입력 값 변경
    function onChangeReportReason(value: string) {
        setReportReason(value)
    }

    //댓글 신고
    async function onReportReply() {
        if (mno) {
            const data = await reportBoard({
                complainant: mno,
                defendant: boardData.mno,
                bno: boardData.bno,
                rno: null,
                content: boardData.content,
                message: reportReason
            })
            alert('게시글 신고 완료')
        }
        closeModal()
    }

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <p className="flex m-6">유저 : {boardData.name}</p>
            <textarea
                value={reportReason}
                onChange={e => onChangeReportReason(e.target.value)}
                className="flex p-3 m-5 border border-black resize-none h-44"
                placeholder="신고 사유"></textarea>
            <div>
                <Button value={'신고'} onClick={onReportReply} />
                <Button value={'취소'} onClick={closeModal} />
            </div>
        </Modal>
    )
}

export default BoardReportModal
