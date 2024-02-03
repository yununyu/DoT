import {
    deleteReplyData,
    registReplyData,
    replyData,
    reportReplyResponseData,
    updateReplyData
} from '../../data/Reply/Reply'
import {reportRequestData} from '../../data/manager'
import {commonAxios} from '../Axios/CommonAxios'
import {refreshAxios} from '../Axios/RefreshAxios'

//댓글 들고오기
export const getParentReply = async (bno: number): Promise<replyData[]> => {
    const response = await commonAxios.get(`/reply/board?bno=${bno}`)
    return response.data
}

//대댓글 들고오기
export const getChildreply = async (bno: number, rno: number): Promise<replyData[]> => {
    const response = await commonAxios.get(`/reply/board?bno=${bno}&rno=${rno}`)
    return response.data
}

//댓글 작성
export const createReply = async (
    registReply: registReplyData
): Promise<{bno: number}> => {
    const response = await refreshAxios.post('/reply/register', registReply)
    return response.data
}

//댓글 수정
export const updateReply = async (
    updateReply: updateReplyData
): Promise<{rno: number}> => {
    const response = await refreshAxios.put('/reply/update', updateReply)
    return response.data
}

//댓글 삭제
export const deleteReply = async (
    deleteReply: deleteReplyData
): Promise<{rno: number}> => {
    const response = await refreshAxios.put('/reply/delete', deleteReply)
    return response.data
}

//댓글 신고
export const reportReply = async (
    reportReply: reportRequestData
): Promise<reportReplyResponseData> => {
    const response = await refreshAxios.post('/report/register', reportReply)
    return response.data
}
