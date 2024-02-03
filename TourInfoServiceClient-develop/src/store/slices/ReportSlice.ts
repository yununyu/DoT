import {createSlice} from '@reduxjs/toolkit'

//Slice를 만들어서 상태값 저장하고싶은 거 추가하면 됨
//useSelect를 이용해서 상태 값에 접근할 수 있고
//dispatch를 이용해서 reducers에 접근하여 값 변경 할 수 있음

interface CommonState {
    isDone: number
}

const initialState: CommonState = {
    isDone: 0
}

export const ReportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setIsDone(state) {
            state.isDone += 1
        }
    }
})

export const {setIsDone} = ReportSlice.actions

export default ReportSlice
