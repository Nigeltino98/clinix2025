import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { fluidIntakeList: [], selectedFluidIntake:{} }

const fluidIntakeSlice = createSlice({
    name: 'fluidIntake',
    initialState: initialAuthState,
    reducers: {
        setFluidIntake(state, action) {
            state.fluidIntakeList = action.payload
        },
        setSelectedFluidIntake(state, action) {
            state.selectedFluidIntake = action.payload
        }
    }
})
export const fluidIntakeActions = fluidIntakeSlice.actions

export default fluidIntakeSlice.reducer