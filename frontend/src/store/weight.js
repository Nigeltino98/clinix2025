import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { weightList: [], selectedWeight:{}}

const weightSlice = createSlice({
    name: 'weight',
    initialState: initialAuthState,
    reducers: {
        setWeight(state, action) {
            state.weightList = action.payload
        },
        setSelectedWeight(state, action) {
            state.selectedWeight = action.payload
        }
    }
})
export const weightActions = weightSlice.actions

export default weightSlice.reducer