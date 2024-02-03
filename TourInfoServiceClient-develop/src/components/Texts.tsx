import type {FC, DetailedHTMLProps, HTMLAttributes} from 'react'
import {makeClassName} from './textUtil'

type TextProps = DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
>

export type HeadlineProps = TextProps & {
    numberOfLines?: number
}
export const Headline: FC<HeadlineProps> = ({
    className: _className,
    numberOfLines,
    ...props
}) => {
    const className = makeClassName(
        'font-bold text-5xl text-center whitespace-pre-line',
        _className,
        numberOfLines
    )
    return <p {...props} className={className} />
}

export type TitleProps = HeadlineProps & {}
export const Title: FC<SubtitleProps> = ({
    className: _className,
    numberOfLines,
    ...props
}) => {
    const className = makeClassName(
        'font-bold text-3xl text-center whitespace-pre-line',
        _className,
        numberOfLines
    )
    return <p {...props} className={className} />
}

export type SubtitleProps = HeadlineProps & {value?: string}
export const Subtitle: FC<SubtitleProps> = ({
    className: _className,
    numberOfLines,
    children,
    ...props
}) => {
    const className = makeClassName(
        'font-semibold text-center whitespace-pre-line',
        _className,
        numberOfLines
    )
    return (
        <p {...props} className={className}>
            {props.value}
            {children}
        </p>
    )
}

export type CaptionProps = SubtitleProps & {}
export const Caption: FC<CaptionProps> = ({
    className: _className,
    numberOfLines,
    ...props
}) => {
    const className = makeClassName(
        'text-sm whitespace-pre-line',
        _className,
        numberOfLines
    )
    return <p {...props} className={className} />
}

export type BodyProps = SubtitleProps & {}
export const Body: FC<BodyProps> = ({className: _className, numberOfLines, ...props}) => {
    const className = makeClassName(
        'font-normal text-base whitespace-pre-line',
        _className,
        numberOfLines
    )
    return <p {...props} className={className} />
}
