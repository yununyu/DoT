import {useParams} from 'react-router-dom'
import {ProfileBox, SimpleMap, Title, WritingButton} from './../../components/index'

export const MyPage = () => {
    const {mno} = useParams()

    return (
        <div className="flex flex-col justify-between w-full ">
            <div className="flex flex-row items-center justify-center w-full ">
                <div className="flex justify-center min-w-[1200px] w-[1200px] my-20 h-full">
                    <div className="flex items-center justify-center w-full shadow-2xl rounded-2xl basis-1/2">
                        <ProfileBox mno={Number(mno)} />
                    </div>

                    <div className="flex flex-col items-center justify-center w-full px-20 shadow-2xl rounded-2xl basis-1/2">
                        <Title className="mt-16">여행기록</Title>
                        <SimpleMap className="-mt-16" mno={Number(mno)} />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center w-full">
                    <WritingButton mno={Number(mno)} />
                </div>
            </div>
        </div>
    )
}
