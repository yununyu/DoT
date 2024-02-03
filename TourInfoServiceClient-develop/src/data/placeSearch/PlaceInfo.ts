// 장소 정보
export type PlaceData = {
    pno: number
    name: string
    lng: number
    lat: number
    roadAddress: string
    localAddress: string
    engAddress: string
    category: string
    cart: string
    regDate: string
    image: string
}

//장소별 장소 정보
export type PlaceBoardData = {
    pno: number
    bno: number
    title: string
    src: string[]
    replyCount: number
    writer: string
    regdate: string
    likes: number
    score: number
    ad: boolean
    lng: number
    lat: number
    roadAddress: string
    localAddress: string
    engAddress: string
    name: string
}