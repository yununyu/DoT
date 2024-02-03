import {FC, PropsWithChildren, useEffect} from 'react'

type MainFilterProps = {
    text: string
    filterChange: (filter: string) => void
    color?: string
}

const MainFilter: FC<PropsWithChildren<MainFilterProps>> = ({
    children,
    text,
    filterChange,
    color
}) => {
    function updateFilter() {
        filterChange(text === '장소' ? 'place' : text === '코스' ? 'course' : 'user')
    }

    return (
        <div
            onClick={updateFilter}
            className={`transition-all duration-150 flex items-center justify-center py-2 px-3 cursor-pointer rounded-2xl ${color}`}>
            {children}
            <button
                value={text === '장소' ? 'place' : text === '코스' ? 'course' : 'user'}
                className={`ml-2 text-lg font-semibold`}>
                {text}
            </button>
        </div>
    )
}

export default MainFilter
