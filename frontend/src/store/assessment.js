import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { assessmentList: [], selectedAssessment:{}}

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState: initialAuthState,
    reducers: {
        setAssessment(state, action) {
            state.assessmentList = action.payload
        },
        setSelectedAssessments(state, action) {
            state.selectedAssessment = action.payload
        }
    }
})
export const assessmentActions = assessmentSlice.actions

export default assessmentSlice.reducer