import {
    ButtonHTMLAttributes,
    Children,
    DetailedHTMLProps,
    FC,
    forwardRef,
    PropsWithChildren
} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '../store/rootReducer'

//버튼 스타일

type ReactButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>

type ButtonProps = ReactButtonProps & {value?: string}

export const Button = forwardRef<HTMLInputElement, ButtonProps>((props, ref) => {
    const {className: _className, ...buttonProps} = props
    const className = ['btn m-1 p-5 border rounded-lg', _className].join(' ')

    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    )
})

type DropdownProps = {
    texts?: string[]
    replyMno?: number
    replyParent?: number | null
    onGetDropdownValue: (value: string) => void
}

// 버튼st dropdown list
export const DropdownButton: FC<PropsWithChildren<DropdownProps>> = props => {
    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="m-1 btn">
                {props.children}
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {props.texts &&
                    props.texts.map((text, index) => (
                        <li key={index}>
                            <a>{text}</a>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

// icon button dropdown list
export const DropdownIcon: FC<PropsWithChildren<DropdownProps>> = props => {
    const mno = useSelector((state: RootState) => state.login.mno)
    let text
    if (props.replyMno == mno && props.replyParent == null) {
        text = ['댓글 달기', '수정', '삭제']
    } else if (props.replyMno == mno && props.replyParent) {
        text = ['수정', '삭제']
    } else if (props.replyParent) {
        text = ['신고']
    } else {
        text = ['댓글 달기', '신고']
    }
    //props.replyMno == mno && props.replyParent==null ? ['댓글 달기', '수정', '삭제'] :props.replyParent!==null ? ['댓글 달기', '신고'] :['신고']

    return (
        <div className="dropdown dropdown-bottom dropdown-end">
            <label tabIndex={0} className="m-1">
                {props.children}
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {text.map((text, index) => (
                    <li key={index}>
                        <p onClick={() => props.onGetDropdownValue(text)}>{text}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

type DropbtnProps = {
    itemTexts: string[] // 각 항목의 텍스트 배열
    itemActions: (() => void)[] // 각 항목의 동작을 나타내는 함수 배열
    itemEnabled: boolean[] // 각 항목의 활성화 여부를 나타내는 boolean 배열
}

export const DropIcon: FC<PropsWithChildren<DropbtnProps>> = props => {
    const handleItemClick = (index: number) => {
        console.log(props.itemActions[index], 'clicked')
        props.itemActions[index]()
    }

    return (
        <div className={`dropdown dropdown-bottom dropdown-end`}>
            <label tabIndex={0} className="m-1">
                {props.children}
            </label>
            <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {props.itemTexts.map(
                    (text, index) =>
                        props.itemEnabled[index] && (
                            <li key={index} onClick={() => handleItemClick(index)}>
                                <span>{text}</span>
                            </li>
                        )
                )}
            </ul>
        </div>
    )
}

//Dropdown Select 컴포넌트 - children으로 select 넣으면 사용가능

export const DropdownSelect: FC<PropsWithChildren> = ({children}) => {
    return (
        <div className="relative ml-5 ">
            {children}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    )
}

export const LoginUseButton: FC<PropsWithChildren<ReactButtonProps>> = props => {
    const {className: _className, ...buttonProps} = props
    const className = [
        'my-2 inline-block w-full rounded px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]',
        _className
    ].join(' ')
    return (
        <button
            type="submit"
            className={className}
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}

type Oauth2ButtonProps = {
    oauth2: string
}
export const Oauth2LoginButton: FC<PropsWithChildren<Oauth2ButtonProps>> = ({
    children,
    oauth2
}) => {
    return (
        <a
            href={`http://localhost:8080/oauth2/authorization/${oauth2}`}
            className="w-1/6 cursor-pointer hover:translate-y-0.5 hover:duration-150">
            {children}
        </a>
    )
}
