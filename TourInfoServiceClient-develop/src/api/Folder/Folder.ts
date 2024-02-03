import {
    folderAll,
    folder,
    registerFolderData,
    updateFolderData,
    deleteFolderData,
    spotAddData
} from './../../data/Folder/Folder'
import {commonAxios} from './../Axios/CommonAxios'
import {refreshAxios} from './../Axios/RefreshAxios'

export const ShowFolderAll = async (mno: number): Promise<folderAll> => {
    const response = await refreshAxios.get(`/folder/all/${mno}`)
    return response.data
}

export const ShowFolderInfo = async (mno: number): Promise<folder> => {
    const response = await refreshAxios.get(`/folder/title/${mno}`)
    return response.data
}

export const registerFolder = async (
    registerFolderData: registerFolderData
): Promise<registerFolderData> => {
    const response = await refreshAxios.post(`/folder/register`, registerFolderData)
    return response.data
}

export const updateFolder = async (
    updateFolderData: updateFolderData
): Promise<updateFolderData> => {
    const response = await refreshAxios.put(`/folder/update`, updateFolderData)
    return response.data
}

export const deleteFolder = async (fno: number): Promise<deleteFolderData> => {
    const response = await refreshAxios.delete(`/folder/delete/${fno}`)
    return response.data
}

export const appendCart = async (spotAddData: spotAddData): Promise<spotAddData> => {
    const response = await refreshAxios.post(`/folder/cart-append`, spotAddData)
    return response.data
}

export const deleteCart = async (
    mno: number,
    pno: number,
    fno: number
): Promise<void> => {
    const response = await refreshAxios.delete(`/folder/cart-delete`, {
        data: {mno, pno, fno}
    })
    return response.data
}
