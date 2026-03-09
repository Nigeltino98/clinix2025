import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { riskSchedulerList: [], selectedriskScheduler:{}}

const riskSchedulerSlice = createSlice({
    name: 'riskschedulerscheduler',
    initialState: initialAuthState,
    reducers: {
        setRiskScheduler(state, action) {
            state.riskSchedulerList = action.payload
        },
        setSelectedriskScheduler(state, action) {
            state.selectedriskScheduler = action.payload
        }
    }
})
export const riskSchedulerActions = riskSchedulerSlice.actions

export default riskSchedulerSlice.reducer