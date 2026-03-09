import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { moodList: [], selectedMoods:{} }

const moodSlice = createSlice({
    name: 'mood',
    initialState: initialAuthState,
    reducers: {
        setMoods(state, action) {
            state.moodList = action.payload
        },
        setSelectedMoods(state, action) {
            state.selectedMoods = action.payload
        }
    }
})
export const moodActions = moodSlice.actions

export default moodSlice.reducer