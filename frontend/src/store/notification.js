import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { notificationList: [], selectedNotification: {} }

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialAuthState,
    reducers: {
        setNotification(state, action) {
            state.notificationList = action.payload
        },
        setSelectedNotification(state, action) {
            state.selectedNotification = action.payload
        },
    }
})
export const notificationActions = notificationSlice.actions

export default notificationSlice.reducer