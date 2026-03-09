import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { morningRoutineList: [], selectedMorningRoutines:{} }

const morningRoutineSlice = createSlice({
    name: 'morningRoutine',
    initialState: initialAuthState,
    reducers: {
        setMorningRoutine(state, action) {
            state.morningRoutineList = action.payload
        },
        setSelectedMorningRoutines(state, action) {
            state.selectedMorningRoutines = action.payload
        }
    }
})
export const morningRoutineActions = morningRoutineSlice.actions

export default morningRoutineSlice.reducer