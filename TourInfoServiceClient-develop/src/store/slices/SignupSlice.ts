import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface CommonState {
    email: String | null
}

const initialState: CommonState = {
    email: null
}

export const SignupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload
        }
    }
})

export const {setEmail} = SignupSlice.actions

export default SignupSlice
