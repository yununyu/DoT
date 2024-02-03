import {combineReducers} from 'redux'
import ReportSlice from './slices/ReportSlice'
import LoginSlice from './slices/LoginSlice'
import SearchSlice from './slices/SearchSlice'
import SignupSlice from './slices/SignupSlice'
import ManagerSlice from './slices/ManagerSlice'
import CourseSlice from './slices/CourseSlice'

//리듀서 등록
export const rootReducer = combineReducers({
    report: ReportSlice.reducer,
    login: LoginSlice.reducer,
    search: SearchSlice.reducer,
    signup: SignupSlice.reducer,
    manager: ManagerSlice.reducer,
    course: CourseSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
