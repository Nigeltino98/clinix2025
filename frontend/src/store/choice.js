import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { choiceList: [], selectedChoice: {} }

const choiceSlice = createSlice({
    name: 'choice',
    initialState: initialAuthState,
    reducers: {
        setChoices(state, action) {
            state.choiceList = action.payload
        },
        setSelectedSelected(state, action) {
            state.selectedChoice = action.payload
        }
    }
})
export const choiceActions = choiceSlice.actions

export default choiceSlice.reducer
