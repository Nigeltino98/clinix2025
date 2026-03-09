import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { appointmentList: [], selectedAppointment: {} }

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: initialAuthState,
    reducers: {
        setAppointments(state, action) {
            state.appointmentList = action.payload
        },
        setSelectedSelected(state, action) {
            state.selectedAppointment = action.payload
        }
    }
})
export const appointmentActions = appointmentSlice.actions

export default appointmentSlice.reducer
