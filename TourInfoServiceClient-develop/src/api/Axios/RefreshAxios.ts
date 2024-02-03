import axios, {AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios'
import {refresh, refreshErrorHandle} from '../refresh'
import {getWithTokenExpire} from '../../util/localStorage'

export const refreshAxios = axios.create({
    baseURL: process.env.REACT_APP_DOT_ADDRESS,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getWithTokenExpire('token')}`
    }
})

export const refreshFormAxios = axios.create({
    baseURL: process.env.REACT_APP_DOT_ADDRESS,
    headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getWithTokenExpire('token')}`
    }
})

// 이런식으로 추가만 해주면 refresh 토큰 자동 발행
refreshAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =>
        refresh(config) as unknown as Promise<InternalAxiosRequestConfig>,
    refreshErrorHandle
)

refreshFormAxios.interceptors.request.use(
    (config: AxiosRequestConfig) =>
        refresh(config) as unknown as Promise<InternalAxiosRequestConfig>,
    refreshErrorHandle
)
