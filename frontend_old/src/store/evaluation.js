import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { evaluationList: [], selectedEvaluation:{}}

const evaluationSlice = createSlice({
    name: 'evaluation',
    initialState: initialAuthState,
    reducers: {
        setEvaluation(state, action) {
            state.evaluationList = action.payload
        },
        setSelectedEvaluation(state, action) {
            state.selectedEvaluation = action.payload
        }
    }
})
export const evaluationActions = evaluationSlice.actions

export default evaluationSlice.reducer