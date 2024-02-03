//신고 요청
export type reportRequestData = {
    complainant: number
    defendant: number
    bno: number | null
    rno: number | null
    content: string
    message: string
}

//유저 제재 내역 전체 조회
export type DisciplinaryUserData = {
    result: boolean
    data: Array<{
        dno: number
        complainant_mno: number
        mno: number
        reason: string
        strDate: string
        expDate: string
    }>
}

//신고 정보 요청 결과
export type ReportResponseData = {
    result: boolean
    data: Array<{
        sno: number
        complainant_mno: number
        complainant: string | null
        defendant_mno: number
        defendant: string | null
        bno: number | null
        rno: number | null
        content: string
        isDone: boolean
        message: string
        regDate: string
    }>
}

//신고 정보
export type ReportData = {
    sno: number
    complainant_mno: number
    complainant: string | null
    defendant_mno: number
    defendant: string | null
    bno: number | null
    rno: number | null
    content: string
    isDone: boolean
    message: string
    regDate: string
}

//신고 업데이트등 요청 결과
export type ReportCheckData = {
    result: boolean
    data: number
}
