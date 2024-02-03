import {commonAxios} from '../Axios/CommonAxios'

export const mailResendRequest = async (email: string): Promise<void> => {
    const response = await commonAxios.post('auth/email/re-validation', email)
    return response.data
}
