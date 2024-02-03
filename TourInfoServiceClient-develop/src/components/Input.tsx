import type {DetailedHTMLProps, InputHTMLAttributes} from 'react'
import {forwardRef} from 'react'

// prettier-ignore
export type ReactInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement>

//comment
export type InputProps = ReactInputProps & {value?: string}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {className: _className, ...inputProps} = props
    const className = ['input focus:outline-none', _className].join(' ')
    return <input ref={ref} {...inputProps} className={className} />
})

// 로그인 input props로 input값(value) onChange이벤트, placeHolder값(text) 넣어서 사용, className은 선택
type LoginInputProps = {
    value: string //input value
    onChange?: (value: string) => void // onChange Event
    className?: string
    text: string //placeHolder
    disabled?: boolean
    type?: string
}

export const LoginInput: React.FC<LoginInputProps> = ({
    value,
    onChange,
    className,
    text,
    disabled,
    type
}) => {
    return (
        <div className={`relative ${className}`} data-te-input-wrapper-init>
            <input
                type={type}
                className="border rounded-lg focus:border-primary-focus  peer block min-h-[auto] w-full bg-transparent px-3 pt-3 pb-2 leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id="id_input"
                value={value}
                disabled={disabled}
                onChange={e => onChange && onChange(e.target.value)}
            />
            <label
                htmlFor="exampleFormControlInput3"
                className={`pointer-events-none absolute left-3 top-1 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.7rem] peer-focus:scale-[0.75] peer-focus:text-primary ${
                    value ? 'translate-y-[-0.7rem] scale-[0.75]' : ''
                } motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary`}>
                {text}
            </label>
        </div>
    )
}
