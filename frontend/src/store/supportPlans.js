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

       updatePlan(state, action) {
            const updated = action.payload;

            const index = state.planList.findIndex(p => p.id === updated.id);

            if (index !== -1) {
                state.planList[index] = updated;
            }

            if (state.selectedPlan?.id === updated.id) {
                state.selectedPlan = updated;
            }
        },
    }
})
export const planActions = planSlice.actions

export default planSlice.reducer