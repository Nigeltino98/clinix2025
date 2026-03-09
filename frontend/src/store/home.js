import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { homeList: [], selectedHome: {  } }

const homeSlice = createSlice({
    name: 'home',
    initialState: initialAuthState,
    reducers: {
        setHome(state, action) {
            state.homeList = action.payload
        },
        setSelectedHome(state, action) {
            state.selectedHome = action.payload
        },
    }
})
export const homeActions = homeSlice.actions

export default homeSlice.reducer