import {faXmark} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {FC, PropsWithChildren} from 'react'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    className?: string
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
    isOpen,
    onClose,
    children,
    className
}) => {
    if (!isOpen) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex overflow-auto bg-gray-600 bg-opacity-50 ${className}`}>
            <div className="relative flex flex-col w-full max-w-screen-lg p-8 px-10 m-auto bg-white rounded-xl">
                <span className="absolute top-0 right-0 p-4" onClick={onClose}>
                    <button>
                        <FontAwesomeIcon icon={faXmark} size="2xl" />
                    </button>
                </span>
                {children}
            </div>
        </div>
    )
}
