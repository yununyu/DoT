import {
    faPlus,
    faPen,
    faMinus,
    faCheck,
    faX,
    faCartShopping
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FC, useEffect, useState} from 'react'
import {
    ShowFolderAll,
    appendCart,
    deleteFolder,
    registerFolder,
    updateFolder
} from '../../../api'
import {RootState} from '../../../store/rootReducer'
import {useSelector} from 'react-redux'
import {
    folderAll,
    registerFolderData,
    updateFolderData
} from '../../../data/Folder/Folder'
import {Modal} from '../../Modal'

type Pno = {
    pno: number
    onCloseModal: () => void
}

export const PlaceCartModal: FC<Pno> = ({pno, onCloseModal}) => {
    const user = useSelector((state: RootState) => state.login.mno)!

    const [folderData, setFolderData] = useState<folderAll | null>(null)
    const [folderTitle, setFolderTitle] = useState<string>('')
    const [foldersTitle, setFoldersTitles] = useState<string[]>([])
    const [refreshFlag, setRefreshFlag] = useState<boolean>(false)
    const [editingFolder, setEditingFolder] = useState<number>(0)

    const newFolderData: registerFolderData = {
        mno: user,
        title: 'NewFolder'
    }

    const updateFolderData: updateFolderData = {
        fno: editingFolder,
        mno: user,
        title: folderTitle
    }

    const selectFolder = (fno: number) => {
        setEditingFolder(fno)
    }

    const confirmUpdate = (index: number) => {
        folderUpdate(index)
        setEditingFolder(0)
    }

    async function fetchData() {
        try {
            const data = await ShowFolderAll(user)
            setFolderData(data)
            setFoldersTitles(data.data.map(item => item.title))
        } catch (err) {
            console.error(err)
        }
    }

    async function folderRegister() {
        try {
            const data2 = await registerFolder(newFolderData)
            setRefreshFlag(!refreshFlag) // 상태 변경 부분
        } catch (error) {
            console.log(error)
        }
    }

    //폴더 업데이트
    async function folderUpdate(index: number) {
        try {
            const data3 = await updateFolder({
                fno: editingFolder,
                mno: user,
                title: foldersTitle[index]
            })
            alert('폴더명 변경 완료')
            setRefreshFlag(!refreshFlag) // 상태 변경 부분
        } catch (error) {
            console.log(error)
        }
    }

    //폴더 삭제
    async function folderDelete(fno: number) {
        try {
            const data4 = await deleteFolder(fno)
            setRefreshFlag(!refreshFlag) // 상태 변경 부분
        } catch (error) {
            console.log(error)
        }
    }

    //폴더 선택
    async function folderSelect(fno: number) {
        try {
            const data4 = await appendCart({
                mno: user,
                fno: fno,
                pno: pno
            })
            alert('등록되었습니다.')
            onCloseModal()
            setRefreshFlag(!refreshFlag) // 상태 변경 부분
        } catch (error) {
            console.log(error)
        }
    }

    //폴더명 변경
    function onChangeFolder(index: number, title: string) {
        const folder = [...foldersTitle]
        folder[index] = title
        setFoldersTitles(folder)
    }

    useEffect(() => {
        fetchData()
    }, [refreshFlag])

    return (
        // FIX ReportModal 명 수정예정
        <Modal className="cursor-default" onClose={onCloseModal} isOpen>
            <div className="flex justify-center w-full">
                <div className="flex flex-col items-center justify-center w-1/2">
                    <h3 className="my-3 text-3xl">모든 장바구니</h3>
                    <div className="mb-3">
                        <h3 className="flex items-center justify-center text-xl text-center">
                            어느 바구니에 넣을지 선택하세요!
                            {folderData && (
                                <FontAwesomeIcon
                                    onClick={() => {
                                        if (
                                            window.confirm('장바구니를 만드시겠습니까?')
                                        ) {
                                            folderRegister()
                                        }
                                    }}
                                    icon={faPlus}
                                    className="mx-2 text-xl cursor-pointer"
                                />
                            )}
                        </h3>
                    </div>

                    {folderData?.data.map((folder, index) => (
                        <div
                            className="my-2 shadow-xl flex relative justify-center items-center  border-2 rounded-xl min-h-[60px] min-w-[400px] max-w-[400px] border-lightGreen hover:bg-lime-50 duration-150"
                            key={index}>
                            <div className="w-full">
                                {editingFolder === folder.fno ? (
                                    <div className="flex items-center justify-center ">
                                        <input
                                            className="px-3 border-b border-darkGreen"
                                            type="text"
                                            value={foldersTitle[index]}
                                            onChange={e =>
                                                onChangeFolder(index, e.target.value)
                                            }
                                        />
                                        <div className="absolute right-5">
                                            <label>
                                                <FontAwesomeIcon
                                                    size="sm"
                                                    className="mx-3 cursor-pointer"
                                                    icon={faCheck}
                                                    onClick={() => confirmUpdate(index)}
                                                />
                                            </label>
                                            <label>
                                                <FontAwesomeIcon
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() => setEditingFolder(0)}
                                                    icon={faX}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative flex justify-center w-full ">
                                        <div className="w-1/3 overflow-hidden text-left text-ellipsis">
                                            <label
                                                className="items-center overflow-hidden cursor-pointer whitespace-nowrap text-ellipsis"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            `${folder.title} 장바구니에 담겠습니까?`
                                                        )
                                                    ) {
                                                        folderSelect(folder.fno)
                                                    }
                                                }}>
                                                <FontAwesomeIcon
                                                    icon={faCartShopping}
                                                    className="mr-1 "
                                                    size="sm"
                                                />
                                                {folder.title}
                                            </label>
                                        </div>
                                        <div className="absolute right-5">
                                            <label className="mx-3 ">
                                                <FontAwesomeIcon
                                                    size="sm"
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        selectFolder(folder.fno)
                                                    }
                                                    icon={faPen}
                                                />
                                            </label>
                                            <label>
                                                <FontAwesomeIcon
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                '장바구니를 삭제하시겠습니까?'
                                                            )
                                                        ) {
                                                            folderDelete(folder.fno)
                                                        }
                                                    }}
                                                    icon={faMinus}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {folderData && folderData?.data.length <= 0 && (
                        <div>
                            <p className="text-lg">장바구니가 없습니다..</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}
