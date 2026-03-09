import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { riskList: [], selectedrisk:{}}

const riskSlice = createSlice({
    name: 'risk',
    initialState: initialAuthState,
    reducers: {
        setRisk(state, action) {
            state.riskList = action.payload
        },
        setSelectedrisk(state, action) {
            state.selectedrisk = action.payload
        }
    }
})
export const riskActions = riskSlice.actions

export default riskSlice.reducer