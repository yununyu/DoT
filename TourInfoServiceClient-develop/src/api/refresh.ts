import axios, {AxiosRequestConfig} from 'axios'
import Cookie from 'js-cookie'
import {getCookie} from '../util/cookie'
import {getWithTokenExpire, setWithTokenExpire} from '../util/localStorage'
const refresh = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const refreshToken = getCookie('refreshToken')

    let token = getWithTokenExpire('token')

    // 토큰이 만료되었고, refreshToken 이 저장되어 있을 때
    if (token === null && refreshToken) {
        const body = {
            refreshToken
        }
        // 토큰 갱신 서버통신
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_DOT_ADDRESS}/auth/newToken`,
                body
            )
            token = response.data.token
            setWithTokenExpire('token', token)
        } catch (err) {
            console.log(err)
            refreshErrorHandle('로그인 만료!')
        }
    }
    if (!config.headers) {
        config.headers = {}
    }
    if (refreshToken === undefined || refreshToken === null) {
        refreshErrorHandle('로그인 만료!')
        throw new Error('Refresh token expired')
    }
    config.headers['Authorization'] = `Bearer ${token}` // 토큰을 헤더에 설정

    return config
}

let loginExpiredAlertShown = false

const refreshErrorHandle = (err: any) => {
    if (!loginExpiredAlertShown) {
        window.location.href = '/login'
        alert(err)
        loginExpiredAlertShown = true
        Cookie.remove('refreshToken')
    }
}

export {refresh, refreshErrorHandle}
