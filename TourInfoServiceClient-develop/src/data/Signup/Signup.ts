// 회원가입 데이터

export type SignupData = {
    email: string
    password: string
    birth: string
    phone: string
    name: string
    role: string
    businessId?: string
}

export type EmailCheckResponse = {
    isDuplicate: boolean
}

export type SignupResponse = {
    mno: number
}
