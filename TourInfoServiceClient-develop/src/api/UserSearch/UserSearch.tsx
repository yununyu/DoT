import {UserSearchData} from '../../data/User/User'
import {commonAxios} from '../Axios/CommonAxios'
import {refreshAxios} from '../Axios/RefreshAxios'

// 유저 검색 결과 불러오기
export const getSearchUserInfo = async (
    search: string,
    mno: number | null,
    page: number
): Promise<UserSearchData[]> => {
    const response = await commonAxios.post(`/users/find?search=${search}&page=${page}`, {
        mno
    })
    return response.data
}

// 유저 팔로우 기능
export const postFollow = async (
    memberMno: number,
    followerMno: number
): Promise<void> => {
    const response = await refreshAxios.post(`/follow/following`, {
        memberMno,
        followerMno
    })
    return response.data
}

// 유저 팔로우 취소 기능
export const deleteFollow = async (
    memberMno: number,
    followerMno: number
): Promise<void> => {
    const response = await refreshAxios.delete(`/follow/following`, {
        data: {
            memberMno,
            followerMno
        }
    })
    return response.data
}
