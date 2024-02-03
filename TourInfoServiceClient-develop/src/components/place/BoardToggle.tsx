import React, {Children, FC, PropsWithChildren, useState} from 'react'
import {Button} from '../Button'

//토글 버튼 컴포넌트
type ToggleButtonProps = {
    size?: string
}

export const BoardToggle: FC<PropsWithChildren<ToggleButtonProps>> = ({
    children,
    size
}) => {
    const [toggle, setToggle] = useState<boolean>(true)

    //children 배열로 만들어줌
    const result = Children.toArray(children)

    //첫번째 버튼 클릭시 이벤트
    function onChangeFirstButton() {
        setToggle(true)
    }

    //두번째 버튼 클릭시 이벤트
    function onChangeSecondButton() {
        setToggle(false)
    }
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full">
                <div className="flex mb-3">
                    <button
                        onClick={onChangeFirstButton}
                        className={`grid h-16 flex-grow place-items-center : ${size} ${
                            toggle === true
                                ? 'btn btn-ghost bg-darkGreen text-white'
                                : 'btn btn-ghost'
                        }`}>
                        {result[0]}
                    </button>
                    <div className="divider divider-horizontal"></div>
                    <button
                        onClick={onChangeSecondButton}
                        className={`grid h-16  flex-grow  place-items-center ${size} ${
                            toggle === false
                                ? 'btn btn-ghost bg-darkGreen text-white'
                                : 'btn btn-ghost'
                        } `}>
                        {result[1]}
                    </button>
                </div>
            </div>
            {result.length > 2 ? (toggle === true ? result[2] : result[3]) : null}
        </div>
    )
}
