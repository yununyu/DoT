import {commonAxios} from '../Axios/CommonAxios'
import {FindIdResponse, FindPasswordResponse} from '../../data/Find/Find'

// 이메일 찾기
export const FindEmailRequest = async (
    name: string,
    phone: string
): Promise<FindIdResponse> => {
    const response = await commonAxios.post('/auth/email/find', {name, phone})
    return response.data
}

// 비밀번호 찾기
export const FindPasswordRequest = async (
    email: string
): Promise<FindPasswordResponse> => {
    const response = await commonAxios.post('/auth/password/lost', {email})
    return response.data
}
