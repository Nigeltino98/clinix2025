import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { familyList: [], selectedFamily:{}}

const familySlice = createSlice({
    name: 'family',
    initialState: initialAuthState,
    reducers: {
        setFamily(state, action) {
            state.familyList = action.payload
        },
        setSelectedFamily(state, action) {
            state.selectedFamily = action.payload
        }
    }
})
export const familyAction = familySlice.actions

export default familySlice.reducer