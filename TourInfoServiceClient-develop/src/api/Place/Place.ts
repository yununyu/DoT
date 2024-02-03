import {placeInfo} from './../../data/Place/Place'
import {commonAxios} from './../Axios/CommonAxios'

// 장소 등록
export const registerPlace = async (place: placeInfo): Promise<void> => {
    // console.log(place)
    const response = await commonAxios.post(`/place/register`, place)
    return response.data
}
