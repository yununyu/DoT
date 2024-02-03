import {
    DisciplinaryUserData,
    ReportCheckData,
    ReportResponseData
} from '../../data/manager'
import {refreshAxios} from '../Axios/RefreshAxios'

//회원 제재내역 들고오기
export const getUserDisciplinary = async (mno: number): Promise<DisciplinaryUserData> => {
    const response = await refreshAxios.get(`/report/all/${mno}`)
    return response.data
}

//신고 들고오기
export const getAllReport = async (
    page: number,
    filter: string,
    search: string
): Promise<ReportResponseData> => {
    const response = await refreshAxios.get(
        `/report?page=${page}&filter=${filter}&search=${search}`
    )
    return response.data
}

//신고 상태 업데이트 -> 신고 처리 완료
export const checkReport = async (sno: number): Promise<ReportCheckData> => {
    const response = await refreshAxios.put(`/report/update/${sno}`)
    return response.data
}

//제재
export const disciplinary = async (
    sno: number,
    mno: number,
    reason: string
): Promise<ReportCheckData> => {
    const response = await refreshAxios.post('/report/disciplinary', {
        sno,
        mno,
        reason
    })
    return response.data
}
