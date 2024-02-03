import axios from 'axios'

//사업자 확인 axios 기본 셋팅

export const businesAxios = axios.create({
    baseURL: process.env.REACT_APP_BUSINESS_ADDRESS,
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        serviceKey: process.env.REACT_APP_BUSINESS_API
    }
})
