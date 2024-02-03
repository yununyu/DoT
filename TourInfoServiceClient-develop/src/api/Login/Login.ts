import {LoginResponseData} from '../../data/User/User'
import {commonAxios} from '../Axios/CommonAxios'
import {refreshAxios} from '../Axios/RefreshAxios'

//로그인
export const loginRequest = async (
    email: string,
    password: string
): Promise<LoginResponseData> => {
    const response = await commonAxios.post('/auth/login', {email, password})
    return response.data
}

//로그아웃
export const logoutRequest = async () => {
    const response = await refreshAxios.post('/auth/logout')
    return response.data
}
