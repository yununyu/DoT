export type mainItemData = {
    result: boolean
    data: {
        mostBoardPlace: {
            pno: number
            name: string
            src: string | null
            cart: number
            board_count: number
            category: string
        }[]
        recentlyBoard: {
            bno: number
            title: string
            src: string | null
            course: boolean | null
            name: string
            likes: number
            score: number
            regDate: string
        }[]
        mostLikeCourse: {
            mainBoardResponseDTO: {
                bno: number
                title: string
                src: string | null
                course: boolean | null
                name: string
                likes: number
                score: number
                regDate: string
            }
            placeList: {
                name: string
                lat: number
                lng: number
                localAddress: string
                engAddress: string
                roadAddress: string
            }[]
        }[]
        followBoard: {
            bno: number
            title: string
            src: string | null
            course: boolean | null
            name: string
            likes: number
            score: number
            regDate: string
        }[]
        adBoard: {
            bno: number
            title: string
            src: string | null
            course: boolean | null
            name: string
            likes: number
            score: number
            regDate: string
        }[]
    }
}

export type MainPlaceData = {
    pno: number
    name: string
    src: string | null
    cart: number
    board_count: number
    category: string
}

export type MainBoardData = {
    bno: number
    title: string
    src: string | null
    course: boolean | null
    name: string
    likes: number
    score: number
    regDate: string
}
