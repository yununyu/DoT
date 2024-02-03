import {Subtitle} from '../../Texts'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
    faArrowRight,
    faCircleMinus,
    faMinus,
    faPlus
} from '@fortawesome/free-solid-svg-icons'
import {useDispatch} from 'react-redux'
import {addDayAtPosition, deleteDay, deleteItem} from '../../../store/slices/CourseSlice'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import {Spot} from '../../Spot'
import {Item} from './CourseList'
import {FC, useState} from 'react'
import noImage from '../../../assets/smallLogo.png'
import {useNavigate} from 'react-router-dom'
import {Button} from '../../Button'
import {Modal} from '../../Modal'
import {InputPlace} from '../../myPage/MyPocket/InputPlace'

type DayItemProps = {
    day: Item[][]
    create: boolean
}

export const DayItem: FC<DayItemProps> = ({day, create}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // 각 일자에 대한 모달 상태 관리
    const [modalViews, setModalViews] = useState<Record<number, boolean>>({})

    // 모달 열기
    function onOpenModal(dayIndex: number) {
        setModalViews(prev => ({...prev, [dayIndex]: true}))
    }

    // 모달 닫기
    function onCloseModal(dayIndex: number) {
        setModalViews(prev => ({...prev, [dayIndex]: false}))
    }

    //요일 삭제
    const onDeleteDay = (dayIndex: number) => {
        dispatch(deleteDay(dayIndex))
    }

    //원하는 곳에 요일 추가
    const onAddDay = (dayIndex: number) => {
        dispatch(addDayAtPosition(dayIndex + 1))
    }

    //해당 요일의 아이템 제거
    const onDeleteItem = (dayIndex: number, itemIndex: number) => {
        dispatch(deleteItem({dayIndex, itemIndex}))
    }

    return (
        <div className="mt-2">
            {day.map((dayItem, dayIndex) => (
                <div
                    className="flex flex-col px-5 py-3 my-5 border shadow-xl rounded-xl"
                    key={dayIndex}>
                    <div className="flex items-center justify-between">
                        <Subtitle className="flex ">{dayIndex + 1}일차</Subtitle>
                        <div className="flex ">
                            {create && (
                                <div className="flex flex-col justify-between h-full">
                                    <div className="flex items-center justify-around w-full text-sm">
                                        <Button
                                            className="text-white bg-darkGreen"
                                            value={'장소 +'}
                                            onClick={() => onOpenModal(dayIndex)}
                                        />
                                        <Button
                                            className="text-white bg-lightGreen"
                                            value={'day +'}
                                            onClick={() => onAddDay(dayIndex)}
                                        />
                                        <Button
                                            className="text-white bg-red-400"
                                            value={'day -'}
                                            onClick={() => onDeleteDay(dayIndex)}
                                        />
                                    </div>

                                    {modalViews[dayIndex] && (
                                        <Modal
                                            isOpen
                                            onClose={() => onCloseModal(dayIndex)}
                                            key={dayIndex}>
                                            <InputPlace
                                                dayIndex={dayIndex}
                                                onClose={() => onCloseModal(dayIndex)}
                                                className="bg-white border border-none"
                                            />
                                        </Modal>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex min-h-[165px]">
                        <Droppable
                            isDropDisabled={!create}
                            droppableId={`droppable-${dayIndex}`}
                            direction="horizontal">
                            {provided => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex w-full h-full py-3 overflow-x-auto ">
                                    {dayItem.map((item, index) => (
                                        <Draggable
                                            isDragDisabled={!create}
                                            key={item.pname + index}
                                            //추후에 pname대신에 pno를 주는게 맞을거 같음
                                            draggableId={
                                                item.pname + '-' + dayIndex + '-' + index
                                            }
                                            index={index}>
                                            {provided => (
                                                <div
                                                    className="flex m-2"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <div
                                                        className="relative flex items-center justify-center border shadow-xl cursor-pointer hover rounded-2xl"
                                                        onClick={() => {
                                                            !create &&
                                                                navigate(
                                                                    `/board/place/${item.pno}`
                                                                )
                                                        }}>
                                                        <Spot
                                                            key={item.pname + index}
                                                            src={
                                                                item.img
                                                                    ? item.img
                                                                    : noImage
                                                            }
                                                            isRegister={false}>
                                                            {item.pname}
                                                        </Spot>

                                                        <div
                                                            className="absolute flex justify-end cursor-pointer top-1 right-1"
                                                            onClick={() =>
                                                                onDeleteItem(
                                                                    dayIndex,
                                                                    index
                                                                )
                                                            }>
                                                            {create && (
                                                                <FontAwesomeIcon
                                                                    icon={faCircleMinus}
                                                                    style={{
                                                                        color: '#c2c2c2'
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center items-center ml-3">
                                                        {dayItem.length !== index + 1 && (
                                                            <FontAwesomeIcon
                                                                color="darkGreen"
                                                                icon={faArrowRight}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            ))}
        </div>
    )
}
