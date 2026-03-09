import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { accidentSchedulerList: [], selectedAccidentScheduler:{}}

const accidentSchedulerSlice = createSlice({
    name: 'accidentScheduler',
    initialState: initialAuthState,
    reducers: {
        setAccidentSchedulers(state, action) {
            state.accidentSchedulerList = action.payload
        },
        setSelectedAccidentSchedulers(state, action) {
            state.selectedAccidentScheduler = action.payload
        }
    }
})
export const accidentSchedulerActions = accidentSchedulerSlice.actions

export default accidentSchedulerSlice.reducer