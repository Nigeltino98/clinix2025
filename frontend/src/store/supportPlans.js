import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { planList: [], selectedPlan:{}}

const planSlice = createSlice({
    name: 'plan',
    initialState: initialAuthState,
    reducers: {
        setPlans(state, action) {
            state.planList = action.payload
        },
        setSelectedPlans(state, action) {
            state.selectedPlan = action.payload
        },
       addEvaluation(state, action) {
            const { planId, evaluation } = action.payload;
            const plan = state.planList.find((p) => p.id === planId);
            if (plan) {
                plan.evaluations.push(evaluation);
            }
        },
    }
})
export const planActions = planSlice.actions

export default planSlice.reducer