import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { planSchedulerList: [], selectedPlanScheduler:{}}

const planSchedulerSlice = createSlice({
    name: 'planScheduler',
    initialState: initialAuthState,
    reducers: {
        setPlanSchedulers(state, action) {
            state.planSchedulerList = action.payload
        },
        setSelectedPlanSchedulers(state, action) {
            state.selectedPlanScheduler = action.payload
        }
    }
})
export const planSchedulerActions = planSchedulerSlice.actions

export default planSchedulerSlice.reducer