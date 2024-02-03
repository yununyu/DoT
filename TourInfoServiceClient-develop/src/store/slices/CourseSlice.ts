import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Item} from '../../components'

// 개별 객체에 대한 인터페이스 정의

interface AddItem {
    index: number // 아이템을 추가할 날짜의 인덱스
    item: Item // 추가할 아이템
}

// 삭제할 아이템의 날짜 인덱스와 아이템 인덱스를 나타내는 인터페이스
interface DeleteItemPayload {
    dayIndex: number // 아이템을 삭제할 날짜의 인덱스
    itemIndex: number // 삭제할 아이템의 인덱스
}

// 아이템을 이동시킬 때 필요한 정보를 나타내는 인터페이스
interface MoveItemPayload {
    sourceDayIndex: number // 원본 날짜의 인덱스
    targetDayIndex: number // 목표 날짜의 인덱스
    itemIndex: number // 이동시킬 아이템의 인덱스
    targetIndex: number // 목표 날짜에서의 아이템을 삽입할 위치의 인덱스
}

// 아이템을 추가할 때 필요한 정보를 나타내는 인터페이스
interface AddItemAtPositionPayload {
    dayIndex: number // 아이템을 추가할 날짜의 인덱스
    itemIndex: number // 추가할 위치의 인덱스
    item: Item // 추가할 아이템
}

// 배열의 배열 타입 정의
type CommonState = Item[][]

const initialState: CommonState = []

export const CourseSlice = createSlice({
    name: 'placeItem',
    initialState,
    reducers: {
        deleteAll() {
            return initialState
        },
        addDay(state) {
            state.push([])
        },
        addDayAtPosition: (state, action: PayloadAction<number>) => {
            if (action.payload >= 0) {
                state.splice(action.payload, 0, []) // 특정 인덱스에 빈 배열 삽입
            }
        },
        //날짜 데이터 제거
        deleteDay: (state, action: PayloadAction<number | undefined>) => {
            if (action.payload === undefined) {
                if (state.length > 0) {
                    state.pop()
                }
            } else {
                // action.payload가 정의된 경우, 특정 인덱스의 요소를 제거
                const index = action.payload
                if (index >= 0 && index < state.length) {
                    state.splice(index, 1)
                }
            }
        },

        //해당 날짜에 place 추가
        addLastItem: (state, action: PayloadAction<AddItem>) => {
            const {index, item} = action.payload
            if (index >= 0 && index < state.length) {
                // 해당 인덱스의 배열에서 동일한 pno를 가진 item이 있는지 확인
                const existingItem = state[index].find(i => i.pno === item.pno)
                if (!existingItem) {
                    // 동일한 item이 없으면 배열에 추가
                    state[index].push(item)
                }
            }
        },
        //해당 날짜에서 선택한 place제거
        deleteItem: (state, action: PayloadAction<DeleteItemPayload>) => {
            const {dayIndex, itemIndex} = action.payload
            if (dayIndex >= 0 && dayIndex < state.length) {
                const dayItems = state[dayIndex]
                if (itemIndex >= 0 && itemIndex < dayItems.length) {
                    dayItems.splice(itemIndex, 1)
                }
            }
        },
        // 특정 날짜의 아이템을 다른 날짜의 지정된 위치로 이동
        moveItem: (state, action: PayloadAction<MoveItemPayload>) => {
            const {sourceDayIndex, targetDayIndex, itemIndex, targetIndex} =
                action.payload

            // 원본과 목표 날짜 및 인덱스가 유효한 범위 내에 있는지 확인
            if (
                sourceDayIndex >= 0 &&
                sourceDayIndex < state.length &&
                targetDayIndex >= 0 &&
                targetDayIndex < state.length &&
                itemIndex >= 0 &&
                itemIndex < state[sourceDayIndex].length &&
                targetIndex >= 0 &&
                targetIndex <= state[targetDayIndex].length
            ) {
                // 이동시킬 아이템
                const item = state[sourceDayIndex][itemIndex]
                // 아이템을 원본 날짜에서 제거
                state[sourceDayIndex].splice(itemIndex, 1)
                // 아이템을 목표 날짜의 지정된 위치에 삽입
                state[targetDayIndex].splice(targetIndex, 0, item)
            }
        },
        // 원하는 날짜에 원하는 위치로 아이템 추가
        addItemAtPosition: (state, action: PayloadAction<AddItemAtPositionPayload>) => {
            const {dayIndex, itemIndex, item} = action.payload

            if (dayIndex >= 0 && dayIndex < state.length) {
                // dayIndex의 유효성을 확인한 후, 해당 날짜에 아이템 추가
                const dayItems = state[dayIndex]
                if (itemIndex >= 0 && itemIndex <= dayItems.length) {
                    // itemIndex의 유효성을 확인한 후, 해당 위치에 아이템 삽입
                    dayItems.splice(itemIndex, 0, item)
                }
            }
        },
        setCommonState: (state, action: PayloadAction<CommonState>) => {
            return action.payload
        }
    }
})

export const {
    deleteAll,
    addDay,
    addDayAtPosition,
    deleteDay,
    addLastItem,
    deleteItem,
    moveItem,
    addItemAtPosition,
    setCommonState
} = CourseSlice.actions

export default CourseSlice
