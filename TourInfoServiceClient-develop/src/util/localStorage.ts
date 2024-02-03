import {TokenData} from '../data/Token/Token'

// 토큰 저장
export const setWithTokenExpire = (key: string, value: any): void => {
    localStorage.removeItem(key)
    let now = new Date()
    const item: TokenData = {
        value: value, //토큰
        expires: now.getTime() + 8 * 60 * 1000 // 만료시간
    }
    localStorage.setItem(key, JSON.stringify(item))
}

// 유효시간 비교해서 삭제하거나 들고오기
export const getWithTokenExpire = (key: string): any | null => {
    const token = localStorage.getItem(key)

    //없는 경우
    if (!token) {
        return null
    }

    const item: TokenData = JSON.parse(token)
    const now = new Date()

    if (now.getTime() > item.expires) {
        localStorage.removeItem(key)
        return null //만료된 경우
    }

    return item.value
}
