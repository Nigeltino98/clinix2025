import { createSlice } from '@reduxjs/toolkit'

const InitalState = { care: { weight: false, fluidIntake: false, bath: false,  mood: false, sleep: false, morningRoutine: false, afternoonRoutine: false, incident: false } };

const careSlice = createSlice({
    name: 'care',
    initialState: InitalState,
    reducers: {
        setCare(state, action) {
            state.care = action.payload
        }
    }
})
export const careActions = careSlice.actions

export default careSlice.reducer