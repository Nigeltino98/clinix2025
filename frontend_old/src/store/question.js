import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { questionList: [], selectedQuestion:{}}

const questionSlice = createSlice({
    name: 'question',
    initialState: initialAuthState,
    reducers: {
        setQuestion(state, action) {
            state.questionList = action.payload
        },
        setSelectedQuestion(state, action) {
            state.selectedQuestion = action.payload
        }
    }
})
export const questionAction = questionSlice.actions

export default questionSlice.reducer