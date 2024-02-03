import {commonAxios} from '../Axios/CommonAxios'
import {SignupData, EmailCheckResponse, SignupResponse} from '../../data/Signup/Signup'

// 이메일 중복 체크 리퀘스트
export const duplicatedEmailCheckRequest = async (
    email: string
): Promise<EmailCheckResponse> => {
    const response = await commonAxios.post('/auth/email/check', {
        email
    })
    return response.data
}

// 회원가입
export const signupRequest = async (data: SignupData): Promise<SignupResponse> => {
    const {email, password, birth, phone, name, role, businessId} = data
    const response = await commonAxios.post('/auth/signup', {
        email,
        password,
        birth,
        phone,
        name,
        role,
        businessId: businessId || null
    })
    return response.data
}
