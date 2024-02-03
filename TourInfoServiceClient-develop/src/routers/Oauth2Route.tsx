import {useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'
import {setWithTokenExpire} from '../util/localStorage'
import {setCookie} from '../util/cookie'
import {useDispatch} from 'react-redux'
import {setMno} from '../store/slices/LoginSlice'
import {LoadingSppinner} from '../components'

export const Oauth2Route = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<Boolean>(false)
    const [searchParams] = useSearchParams()
    const dispatch = useDispatch()

    useEffect(() => {
        setLoading(true)

        const mno = searchParams.get('mno')

        mno && dispatch(setMno(parseInt(mno)))

        const token = searchParams.get('token')

        const refreshToken = searchParams.get('refreshToken')

        // 토큰이 있으면 로컬 스토리지 및 쿠키에 저장 후 홈으로 이동
        if (token && refreshToken) {
            setWithTokenExpire('token', token)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 3)
            setCookie('refreshToken', refreshToken, {
                path: '/',
                // 추후에 https로 배포할 경우 주석 제거
                // secure: true,
                expires: expiryDate
            })
            navigate('/')
        } else {
            navigate('/login')
        }

        setLoading(false)
    }, [navigate, searchParams])

    return loading ? <LoadingSppinner /> : null
}
