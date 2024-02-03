import React, {FC} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

//input 스타일

type SearchInputProps = {
    value: string
    onChange: (value: string) => void
    className: string
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    placeholder?: string
}

export const SearchInput: FC<SearchInputProps> = ({
    value,
    onChange,
    className,
    onKeyDown,
    placeholder
}) => {
    const inputStyle = `flex items-center ${className} p-2 ml-3 bg-white border-2 border-lightGreen rounded-2xl shadow-xl`
    return (
        <div className={inputStyle}>
            <FontAwesomeIcon
                icon={faMagnifyingGlass}
                color="darkGreen"
                className="mx-1"
            />
            <input
                className="w-full px-2 py-1 text-lg font-medium border-0 outline-0"
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
            />
        </div>
    )
}
