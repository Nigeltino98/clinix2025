import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { evaluationSchedulerList: [], selectedEvaluationScheduler:{}}

const evaluationSchedulerSlice = createSlice({
    name: 'evaluationScheduler',
    initialState: initialAuthState,
    reducers: {
        setEvaluationSchedulers(state, action) {
            state.evaluationSchedulerList = action.payload
        },
        setSelectedEvaluationSchedulers(state, action) {
            state.selectedEvaluationScheduler = action.payload
        }
    }
})
export const evaluationSchedulerActions = evaluationSchedulerSlice.actions

export default evaluationSchedulerSlice.reducer