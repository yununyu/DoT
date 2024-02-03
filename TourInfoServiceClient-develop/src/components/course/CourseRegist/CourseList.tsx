import {FC, useState} from 'react'
import {DragDropContext, OnDragEndResponder} from 'react-beautiful-dnd'
import {RootState} from '../../../store/rootReducer'
import {useSelector} from 'react-redux'
import {addItemAtPosition, moveItem} from '../../../store/slices/CourseSlice'
import {useDispatch} from 'react-redux'
import {DayItem, MyCart} from '../../index'

export type Item = {
    pno: number
    img: string
    pname: string
}

type DndProps = {
    create: boolean
    day: Item[][]
}

export const CourseList: FC<DndProps> = ({create, day}) => {
    const [items, setItems] = useState<Item[]>([])
    const [cartView, setCartView] = useState<boolean>(true)

    //장바구니 열기
    function onOpenCart() {
        setCartView(true)
    }

    //장바구니 닫기
    function onCloseCart() {
        setCartView(false)
    }

    const onChangeItems = (item: Item[]) => {
        setItems(item)
    }

    const userMno = useSelector((state: RootState) => state.login.mno) || 0

    const dispatch = useDispatch()

    const onDragEnd: OnDragEndResponder = result => {
        if (!result.destination) {
            return
        }

        const dropId: number = result.destination.droppableId.includes('-')
            ? Number(result.destination.droppableId.split('-')[1])
            : Number(result.destination.droppableId)

        for (let i = 0; i < day[dropId].length; i++) {
            if (
                day[Number(result.destination.droppableId.split('-')[1])][i].pno ==
                    Number(result.draggableId.split('-')[0]) &&
                !(result.source.droppableId === result.destination.droppableId)
            ) {
                //이미 존재
                return
            }
        }

        // 같은 드롭 가능 구역 내에서의 이동 처리
        if (result.source.droppableId === result.destination.droppableId) {
            const dayIndex = parseInt(result.source.droppableId.split('-')[1])
            // 같은 날짜 안에서 재정렬 처리
            dispatch(
                moveItem({
                    sourceDayIndex: dayIndex,
                    targetDayIndex: dayIndex,
                    itemIndex: result.source.index,
                    targetIndex: result.destination.index
                })
            )
        } else {
            // 다른 드롭 가능 구역 간의 이동 처리
            const sourceDayIndex = parseInt(result.source.droppableId.split('-')[1])
            const destDayIndex = parseInt(result.destination.droppableId.split('-')[1])

            // 아이템을 원본 위치에서 목표 위치로 이동
            if (result.source.droppableId === 'droppable') {
                // 초기 목록에서 날짜별 목록으로 이동
                const itemToMove = items[result.source.index]
                dispatch(
                    addItemAtPosition({
                        dayIndex: destDayIndex,
                        itemIndex: result.destination.index,
                        item: itemToMove
                    })
                )
            } else {
                // 날짜별 목록 간 이동
                dispatch(
                    moveItem({
                        sourceDayIndex: sourceDayIndex,
                        targetDayIndex: destDayIndex,
                        itemIndex: result.source.index,
                        targetIndex: result.destination.index
                    })
                )
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* 장바구니 데이터 */}
            {create && (
                <div className="my-5">
                    <span
                        className="cursor-pointer hover:font-semibold"
                        onClick={!cartView ? onOpenCart : onCloseCart}>
                        {!cartView ? '- 장바구니 열기 -' : '- 장바구니 닫기 -'}
                    </span>
                </div>
            )}
            {create && (
                <div className={cartView ? ' animate-slideDown' : 'animate-slideUp'}>
                    <MyCart
                        onChangeItems={onChangeItems}
                        mno={userMno}
                        animate={cartView ? 'block' : 'hidden'}
                    />
                </div>
            )}
            {/* mno 삭제 */}
            {/* 요일 데이터 */}
            <DayItem day={day} create={create} />
        </DragDropContext>
    )
}
