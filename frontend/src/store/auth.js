import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { loggedin: false, token: {}, user: null }

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state) { state.loggedin = true },
        logout(state) { state.loggedin = false },
        setToken(state, action) {
            state.token = action.payload
        },
        setUser(state, action) {
            state.user = action.payload
        }
    }
})
export const authActions = authSlice.actions

export default authSlice.reducer