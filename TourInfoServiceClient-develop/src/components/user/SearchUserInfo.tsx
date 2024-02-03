import {FC, MouseEvent, useState} from 'react'
import {Button} from '../../components/index'
import {UserSearchData} from '../../data/User/User'
import {useNavigate} from 'react-router-dom'
import {postFollow, deleteFollow} from '../../api/UserSearch/UserSearch'
import {useSelector} from 'react-redux'
import {RootState} from '../../store/rootReducer'
import UserImage from '../../assets/profileImage.jpeg'

type SearchResultProps = {
    userInfo: UserSearchData
}

export const SearchUserInfo: FC<SearchResultProps> = ({userInfo}) => {
    const navigate = useNavigate()

    // user mno
    const user = useSelector((state: RootState) => state.login.mno)!

    const [follow, setFollow] = useState<boolean>(userInfo.followCheck)
    const [totalFollow, setTotalFollow] = useState<number>(userInfo.followers)
    const [buttonText, setButtonText] = useState<string>(
        userInfo.followCheck ? '팔로잉' : '팔로우'
    )

    if (totalFollow == null) {
        setTotalFollow(0)
    }

    async function clickFollow(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation()
        try {
            if (!user || !userInfo) return
            if (follow) {
                // 이미 팔로우 중이라면 언팔로우
                await deleteFollow(userInfo.mno, user)
                setTotalFollow(totalFollow - 1)
                setFollow(!follow)
                setButtonText('팔로우')
            } else {
                await postFollow(userInfo.mno, user)
                setTotalFollow(totalFollow + 1)
                setFollow(!follow)
                setButtonText('팔로잉')
            }
        } catch (error) {
            console.log(error)
        }
    }

    //회원 상세 페이지로 이동
    const onUserDetail = () => {
        navigate(`/mypage/${userInfo.mno}`)
    }

    return (
        <div
            className="flex w-full h-32 my-5 overflow-x-hidden duration-100 border shadow cursor-pointer border-lightGreen stats hover:shadow-xl"
            onClick={onUserDetail}>
            <div
                className={`flex flex-col justify-centerstat stat ${
                    user ? 'basis-1/4' : 'basis-1/3'
                }`}>
                <div className="stat-figure text-secondary">
                    <div className="w-16 h-16 overflow-hidden rounded-full ">
                        <img
                            src={userInfo?.image ? userInfo.image : UserImage}
                            alt="profileImage"
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="my-1 text-base stat-value">{userInfo?.name}</div>
            </div>

            <div
                className={` stat border-lightGreen ${user ? 'basis-1/4' : 'basis-1/3'}`}>
                <div className="stat-title">Total Follower</div>
                <div className="text-base text-rose-500 stat-value">{totalFollow}</div>
            </div>
            <div
                className={` stat border-lightGreen ${user ? 'basis-1/4' : 'basis-1/3'}`}>
                <div className="stat-title">Total Following</div>
                <div className="text-base stat-value text-primary">
                    {userInfo?.followings ? userInfo.followings : 0}
                </div>
            </div>

            {user && (
                <div className="flex items-center justify-center basis-1/4 border-lightGreen">
                    <div className="flex">
                        <Button
                            value={buttonText}
                            onClick={event => {
                                clickFollow(event)
                            }}
                            className={`w-full text-center text-white ${
                                follow ? 'bg-blue-500 ' : 'bg-lightGreen'
                            }`}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
