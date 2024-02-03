import {AxiosInstance} from 'axios'
import {
    ResponseBoard,
    ResponseDeleteResult,
    ImageReturnData,
    saveCourseBoardDTO,
    savePlaceBoardDTO,
    ResponseResult,
    reportBoardResponseData
} from '../../data/Board/BoardData'
import {commonAxios} from '../Axios/CommonAxios'
import {refreshAxios, refreshFormAxios} from '../Axios/RefreshAxios'
import {reportRequestData} from '../../data/manager'

export const placePostLoad = async (
    bno: number,
    isLogin: boolean
): Promise<ResponseBoard> => {
    let response: any = null

    if (isLogin) {
        response = await refreshAxios.get(`/board/place/posting?bno=${bno}`)
    } else {
        response = await commonAxios.get(`/board/place/posting?bno=${bno}`)
    }

    if (response) {
        return response.data // ResponseBoard가 올바른 타입이라고 가정합니다
    } else {
        throw new Error('데이터를 가져오지 못했습니다')
    }
}

export const coursePostLoad = async (
    bno: number,
    isLogin: boolean
): Promise<ResponseBoard> => {
    let response: any = null
    if (isLogin) {
        response = await refreshAxios.get(`/board/course/posting?bno=${bno}`)
    } else {
        response = await commonAxios.get(`/board/course/posting?bno=${bno}`)
    }
    console.log(response.data)
    return response.data
}

export const deleteBoard = async (bno: number): Promise<ResponseDeleteResult> => {
    const response = await refreshAxios.delete(`/board/place/posting/delete?bno=${bno}`)
    return response.data
}

export const postLike = async (mno: number, bno: number): Promise<void> => {
    const response = await refreshAxios.post(`/like/board`, {
        mno,
        bno
    })
    return response.data
}

export const deleteLike = async (mno: number, bno: number): Promise<void> => {
    const response = await refreshAxios.delete(`/like/board`, {
        data: {
            mno,
            bno
        }
    })
    return response.data
}

//이미지 업로드
export const imageUpload = async (image: File): Promise<ImageReturnData> => {
    const response = await refreshFormAxios.post(`/image/upload`, {image})
    return response.data
}

//img list 처리
const parsingImg = (images: ImageReturnData[], content: string) => {
    let deleteImages: string[] = images.map(image => image.src)
    let addImages: number[] = []

    // DOMParser를 사용하여 HTML 파싱
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    // 이미지 태그 찾기
    const imgTags = doc.querySelectorAll('img')

    // 이미지 태그의 src 속성 추출
    imgTags.forEach((imgTag, index) => {
        const src = imgTag.getAttribute('src')
        // console.log(`Image ${index + 1} src: ${src}`);
        addImages.push(...images.filter(img => img.src === src).map(img => img.ino))
        deleteImages = deleteImages.filter(img => img !== src)
    })

    // console.log(addImages)
    // console.log(deleteImages)
    return [[...addImages], [...deleteImages]]
}

// place board upload
export const registPlaceBoard = async (
    board: savePlaceBoardDTO,
    images: ImageReturnData[]
): Promise<ResponseResult> => {
    const imgList = parsingImg(images, board.content)
    board.images = imgList[0] as number[]
    board.deleteImages = imgList[1] as string[]

    // console.log(board)

    const response = await refreshAxios.post(`/board/place/posting/register`, board)
    return response.data
}

// modify place board
export const modifyPlaceBoard = async (
    board: savePlaceBoardDTO,
    images: ImageReturnData[]
): Promise<ResponseResult> => {
    const imgList = parsingImg(images, board.content)
    board.images = imgList[0] as number[]
    board.deleteImages = imgList[1] as string[]

    const response = await refreshAxios.put(`/board/place/posting/modify`, board)
    return response.data
}

// upload course board
export const registCourseBoard = async (
    board: saveCourseBoardDTO,
    images: ImageReturnData[]
): Promise<ResponseResult> => {
    const imgList = parsingImg(images, board.content)
    board.images = imgList[0] as number[]
    board.deleteImages = imgList[1] as string[]

    console.log(board.images)

    const response = await refreshAxios.post(`/board/course/posting/register`, board)
    return response.data
}

// modify course board
export const modifyCourseBoard = async (
    board: saveCourseBoardDTO,
    images: ImageReturnData[]
): Promise<ResponseResult> => {
    const imgList = parsingImg(images, board.content)
    board.images = imgList[0] as number[]
    board.deleteImages = imgList[1] as string[]

    console.log(board.images)

    const response = await refreshAxios.put(`/board/course/posting/modify`, board)
    return response.data
}

export const reportBoard = async (
    boardReply: reportRequestData
): Promise<reportBoardResponseData> => {
    const response = await refreshAxios.post('/report/register', boardReply)
    return response.data
}
