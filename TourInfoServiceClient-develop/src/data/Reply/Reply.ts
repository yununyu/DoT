//댓글 조회 타입
export type replyData = {
    rno: number
    text: string
    parent_rno: number | null
    regDate: string
    mno: number
    name: string
    src: string | null
}

//댓글 등록에 필요한 타입
export type registReplyData = {
    text: string
    bno: number
    mno: number
    parentRno: number | null
}

//댓글 수정에 필요한 타입
export type updateReplyData = {
    rno: number
    mno: number
    text: string
}

//댓글 삭제에 필요한 타입
export type deleteReplyData = {
    rno: number
    mno: number
}

//댓글 신고 리턴 타입
export type reportReplyResponseData = {
    result: boolean
    data: number
}
