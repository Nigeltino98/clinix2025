import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { incidentList: [], selectedIncident: {} }

const incidentSlice = createSlice({
    name: 'incident',
    initialState: initialAuthState,
    reducers: {
        setIncident(state, action) {
            state.incidentList = action.payload
        },
        setSelectedIncident(state, action) {
            state.selectedIncident = action.payload
        }
    }
})
export const incidentActions = incidentSlice.actions

export default incidentSlice.reducer
