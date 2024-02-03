import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface CommonState {
    reportSearch: Boolean
    managerSearch: Boolean
}

const initialState: CommonState = {
    reportSearch: false,
    managerSearch: false
}

export const SearchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setReportSearch(state, action: PayloadAction<Boolean>) {
            state.reportSearch = action.payload
        },
        setManagerSearch(state, action: PayloadAction<Boolean>) {
            state.managerSearch = action.payload
        }
    }
})

export const {setReportSearch, setManagerSearch} = SearchSlice.actions

export default SearchSlice
