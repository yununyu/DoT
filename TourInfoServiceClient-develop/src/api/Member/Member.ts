import {UserInfoData} from '../../data/User/User'
import {refreshAxios} from '../Axios/RefreshAxios'

//회원 정보 조회
export const getUserInfo = async (mno: number): Promise<UserInfoData> => {
    const response = await refreshAxios.get(`/users/info?mno=${mno}`)
    return response.data
}
