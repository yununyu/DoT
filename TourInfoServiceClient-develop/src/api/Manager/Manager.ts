import {ManagerSearchUserData, MnoData, SignupWaitData} from '../../data/User/User'
import {refreshAxios} from '../Axios/RefreshAxios'

//회원 검색
export const managerSearchUser = async (
    page: number,
    filter: string,
    search: string
): Promise<Array<ManagerSearchUserData>> => {
    const response = await refreshAxios.get(
        `/users/filter-find?page=${page}&filter=${filter}&search=${search}`
    )
    return response.data
}

//대기 회원 들고오기
export const getSignupWait = async (page: number): Promise<Array<SignupWaitData>> => {
    const response = await refreshAxios.get(`/users/waiting?page=${page}`)
    return response.data
}

//회원가입 승인
export const signupApprove = async (mno: number): Promise<MnoData> => {
    const response = await refreshAxios.put(`/users/approve?mno=${mno}`)
    return response.data
}

//회원가입 거절
export const userDelete = async (mno: number): Promise<MnoData> => {
    const response = await refreshAxios.delete(`/users/delete?mno=${mno}`)
    return response.data
}
