import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { bathList: []}

const bathSlice = createSlice({
    name: 'bath',
    initialState: initialAuthState,
    reducers: {
        setBaths(state, action) {
            state.bathList = action.payload
        },
        setSelectedBath(state, action) {
            state.selectedBath = action.payload
        }
    }
})
export const bathActions = bathSlice.actions

export default bathSlice.reducer