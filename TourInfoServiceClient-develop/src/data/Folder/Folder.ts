export type folderAll = {
    result: boolean
    data: Array<{
        fno: number
        title: string
        pno: number[]
        name: string[]
        src: string[]
    }>
}

export type folder = {
    result: boolean
    data: Array<{
        fno: number
        title: string
    }>
}

export type registerFolderData = {
    mno: number
    title: string
}

export type updateFolderData = {
    fno: number
    mno: number
    title: string
}

export type deleteFolderData = {
    fno: number
}

export type spotAddData = {
    mno: number
    fno: number
    pno: number
}
