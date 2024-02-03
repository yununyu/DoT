import {FC, useState} from 'react'
import {replyData} from '../../data/Reply/Reply'
import {Button} from '../Button'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import {reportReply} from '../../api'
import {Modal} from '../Modal'

type ReplyReportModalProps = {
    replyData: replyData
    onCloseModal: (value: Boolean) => void
}

const ReplyReportModal: FC<ReplyReportModalProps> = ({replyData, onCloseModal}) => {
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
            const data = await reportReply({
                complainant: mno,
                defendant: replyData.mno,
                bno: null,
                rno: replyData.rno,
                content: replyData.text,
                message: reportReason
            })
            console.log('데이터값 : ', data.data)
            if (data.data == -1) {
                alert('이미 신고한 댓글입니다.')
            } else if (data.data == 1) {
                alert('신고 완료되었습니다.')
            }
        }
        closeModal()
    }

    return (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <p className="flex m-6">유저 : {replyData.name}</p>
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

export default ReplyReportModal
