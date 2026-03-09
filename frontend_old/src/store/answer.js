import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { answerList: [], selectedAnswer: {} }

const answerSlice = createSlice({
    name: 'answer',
    initialState: initialAuthState,
    reducers: {
        setAnswers(state, action) {
            state.answerList = action.payload
        },
        setSelectedAnswer(state, action) {
            state.selectedAnswer = action.payload
        }
    }
})
export const answerActions = answerSlice.actions

export default answerSlice.reducer
