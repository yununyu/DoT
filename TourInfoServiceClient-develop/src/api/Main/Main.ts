import {commonAxios} from '../Axios/CommonAxios'
import {mainItemData} from '../../data/Main/Main'

export const GetMainitemRequest = async (mno: number | null): Promise<mainItemData> => {
    const response = await commonAxios.post('/board/main', {mno})
    return response.data
}
