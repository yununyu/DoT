import {
    Box,
    ShowFollowModal,
    ShowTotalLikes,
    Title,
    LoadingSppinner,
    Modal
} from './../../index'
import {Button} from './../../Button'
import {FC, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {userProfile} from './../../../data/User/User'
import {ShowUserProfile, ShowUserFollowers} from './../../../api/MyPage/ShowUserInfo'
import {postFollow, deleteFollow} from './../../../api/UserSearch/UserSearch'
import {RootState} from './../../../store/rootReducer'
import {useSelector} from 'react-redux'
import common from '../../../assets/profileImage.jpeg'

//TODO - 로그인 mno 받아와서 name 받아오기

type ProfileProps = {
    mno: number
}

export const ProfileBox: FC<ProfileProps> = ({mno}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [userProfile, setUserProfile] = useState<userProfile | null>(null)
    const [followState, setFollowState] = useState<boolean>()
    const [showModal, setShowModal] = useState(false)

    const userMno = useSelector((state: RootState) => state.login.mno)

    const navigate = useNavigate()

    const openModal = () => {
        setShowModal(true)
    }
    const closeModal = () => {
        setShowModal(false)
    }

    function onModify() {
        navigate('/mypage/modify')
    }

    async function onFollow() {
        userMno && (await postFollow(mno, userMno))
        fetchData()
    }

    async function onUnfollow() {
        userMno && (await deleteFollow(mno, userMno))
        fetchData()
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const userProfileData = await ShowUserProfile(mno)
            const userFollowingData = await ShowUserFollowers(mno)

            setUserProfile(userProfileData)
            userFollowingData &&
                setFollowState(
                    userFollowingData.some(data => data.mno === userMno!) ? true : false
                )
            setLoading(false)
        } catch (error) {
            console.error('에러 발생', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [mno, followState])

    return (
        <div>
            {loading && <LoadingSppinner />}
            <div>
                <Box>
                    <div className="flex flex-col items-center justify-between h-full">
                        <Title className="text-2xl text-black mb-9 ">My Profile</Title>
                        <div className="w-32 h-32 my-2 overflow-hidden rounded-full">
                            <img
                                src={userProfile?.image ? userProfile.image : common}
                                alt="프로필이미지"
                                onClick={openModal}
                            />

                            {showModal ? (
                                <Modal isOpen onClose={closeModal}>
                                    <div className="mx-auto">
                                        <img
                                            src={
                                                userProfile?.image
                                                    ? userProfile.image
                                                    : common
                                            }
                                            alt="프로필 사진"
                                            className="object-scale-down h-[600px]"
                                        />
                                    </div>
                                </Modal>
                            ) : null}
                        </div>
                        <h1 className="my-2 text-xl font-semibold">
                            {userProfile ? userProfile.name : ''}
                        </h1>
                        <ShowFollowModal
                            userName={userProfile?.name}
                            following={
                                userProfile ? userProfile.followings.toString() : ''
                            }
                            follower={userProfile ? userProfile.followers.toString() : ''}
                        />

                        {userMno === userProfile?.mno && (
                            <ShowTotalLikes
                                mno={Number(mno)}
                                cart={userProfile && userProfile.cart}
                            />
                        )}

                        {userMno &&
                            (userMno === userProfile?.mno ? (
                                <div>
                                    <Button
                                        value="정보 수정"
                                        onClick={onModify}
                                        className="w-full text-white bg-lightGreen"
                                    />
                                </div>
                            ) : followState === true ? (
                                <Button
                                    value="언팔로우"
                                    onClick={onUnfollow}
                                    className="w-full text-white bg-red-500"
                                />
                            ) : (
                                <Button
                                    value="팔로우"
                                    onClick={onFollow}
                                    className="w-full text-white bg-blue-500"
                                />
                            ))}
                    </div>
                </Box>
            </div>
        </div>
    )
}
