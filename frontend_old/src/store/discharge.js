import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { dischargeList: [], selectedDischarge: {} }

const dischargeSlice = createSlice({
    name: 'discharge',
    initialState: initialAuthState,
    reducers: {
        setDischarge(state, action) {
            state.dischargeList = action.payload
        },
        setSelectedDischarge(state, action) {
            state.selectedDischarge = action.payload
        }
    }
})
export const dischargeActions = dischargeSlice.actions

export default dischargeSlice.reducer
