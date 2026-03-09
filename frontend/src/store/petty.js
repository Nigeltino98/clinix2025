import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { pettyList: [] }

const pettySlice = createSlice({
    name: 'petty',
    initialState: initialAuthState,
    reducers: {
        setPetty(state, action) {
            state.pettyList = action.payload
        },
    }
})
export const pettyActions = pettySlice.actions

export default pettySlice.reducer