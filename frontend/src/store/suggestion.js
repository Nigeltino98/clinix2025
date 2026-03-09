import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { suggestionList: [], selectedSuggestion: {} }

const suggestionSlice = createSlice({
    name: 'suggestion',
    initialState: initialAuthState,
    reducers: {
        setSuggestions(state, action) {
            state.suggestionList = action.payload
        },
        setSelectedSuggestion(state, action) {
            state.selectedSuggestion = action.payload
        }
    }
})
export const suggestionActions = suggestionSlice.actions

export default suggestionSlice.reducer
