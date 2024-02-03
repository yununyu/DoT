import {FC} from 'react'

type NotFoundProps = {}

export const NotFound: FC<NotFoundProps> = ({}) => {
    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="h-1/2">NotFound Page... &#x1F623;</div>
        </div>
    )
}
