import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { staffList: [], selectedStaff: {} }

const staffSlice = createSlice({
    name: 'staff',
    initialState: initialAuthState,
    reducers: {
        setStaff(state, action) {
            state.staffList = action.payload
        },
        setSelectedStaff(state, action) {
            state.selectedStaff = action.payload
        }
    }
})
export const staffActions = staffSlice.actions

export default staffSlice.reducer