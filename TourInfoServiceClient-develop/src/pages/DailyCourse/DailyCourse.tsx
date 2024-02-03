import {FC, PropsWithChildren, useState} from 'react'
import {Box, Title, Spot} from '../../components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons'

type DailyCourseType = {
    day: number // 여행 일정 기간
    isRegister: boolean // 등록 페이지 t/f
}

// n일차 일정
export const DailyCourse: FC<PropsWithChildren<DailyCourseType>> = props => {
    const [place, setPlace] = useState<number>(0)
    const places = Array.from({length: place}).map((_, index) => (
        <Spot key={index} src="" isRegister={props.isRegister}>
            {'spot ' + index}
        </Spot>
    ))
    // 일정 장소 추가
    function plusPlace() {
        // 장소 추가 로직
        setPlace(place + 1)
    }
    return (
        <Box>
            <div>
                <Title>{props.day}일차</Title>
                <div className="flex items-center">
                    {places}
                    {props.isRegister && (
                        <FontAwesomeIcon
                            className="m-6 hover:cursor-pointer"
                            icon={faCirclePlus}
                            size="2xl"
                            style={{color: '#c2c2c2'}}
                            onClick={plusPlace}
                        />
                    )}
                </div>
            </div>
        </Box>
    )
}
