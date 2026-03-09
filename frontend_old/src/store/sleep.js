import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { sleepList: [], selectedSleep:{}}

const sleepSlice = createSlice({
    name: 'sleep',
    initialState: initialAuthState,
    reducers: {
        setSleep(state, action) {
            state.sleepList = action.payload
        },
        setSelectedSleeps(state, action) {
            state.selectedSleep = action.payload
        }
    }
})
export const sleepActions = sleepSlice.actions

export default sleepSlice.reducer