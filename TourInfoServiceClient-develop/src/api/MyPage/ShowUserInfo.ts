import {
    user,
    userProfile,
    userReply,
    userBoard,
    userCourse,
    userFollows,
    userPlaceCount,
    UserInfoData
} from './../../data/User/User'
import {refreshAxios, refreshFormAxios} from './../Axios/RefreshAxios'
import {commonAxios} from './../Axios/CommonAxios'

// 회원정보 수정 페이지에 사용될 사용자 정보
export const ShowUserInfo = async (mno: number): Promise<user> => {
    const response = await refreshAxios.get(`/users/info?mno=${mno}`)
    return response.data
}

// 회원정보 수정
export const onChangeUserData = async (
    user: any,
    image: File | null
): Promise<UserInfoData> => {
    const formData = new FormData() // formData 생성
    formData.append(
        'member',
        new Blob(
            [
                JSON.stringify({
                    mno: user.mno,
                    name: user.name,
                    phone: user.phone,
                    email: user.email
                })
            ],
            {type: 'application/json'}
        )
    )
    formData.append('image', image || new Blob())
    const response = await refreshFormAxios.put('users/info/update', formData)
    return response.data
}

// 마이페이지에 사용될 사용자 프로필 정보
export const ShowUserProfile = async (mno: number): Promise<userProfile> => {
    const response = await commonAxios.get(`/users/profile?mno=${mno}`)
    return response.data
}

// 사용자가 작성한 댓글
export const ShowUserReply = async (mno: number): Promise<userReply> => {
    const response = await commonAxios.get(`/reply/member?mno=${mno}`)
    return response.data
}

// 작성 게시글
export const ShowUserBoard = async (mno: number): Promise<userBoard> => {
    const response = await commonAxios.get(`/board/place/posting/member?mno=${mno}`)
    return response.data
}

// 작성 코스 게시글
export const ShowUserCourse = async (mno: number): Promise<userCourse> => {
    const response = await commonAxios.get(`/board/course/posting/member?mno=${mno}`)
    return response.data
}

// 팔로잉 조회
export const ShowUserFollowings = async (mno: number): Promise<userFollows[]> => {
    const response = await commonAxios.get(`/follow/followings?mno=${mno}`)
    return response.data
}

// 팔로워 조회
export const ShowUserFollowers = async (mno: number): Promise<userFollows[] | null> => {
    const response = await commonAxios.get(`/follow/followers?mno=${mno}`)
    return response.data
}

//방문수 조회
export const ShowPlaceCount = async (mno: number): Promise<userPlaceCount> => {
    const response = await commonAxios.get(`/place/placecount?mno=${mno}`)
    return response.data
}

export const deleteId = async (mno: number): Promise<void> => {
    const response = await refreshAxios.delete(`/users/delete?mno=${mno}`)
    return response.data
}

export const changePw = async (
    email: string,
    oldPassword: string,
    newPassword: string
): Promise<void> => {
    const response = await refreshAxios.post(`/auth/password/change`, {
        email,
        oldPassword,
        newPassword
    })
    return response.data
}
