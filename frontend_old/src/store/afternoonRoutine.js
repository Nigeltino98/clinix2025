import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { afternoonRoutineList: [], selectedAfternoonRoutines:{} }

const afternoonRoutineSlice = createSlice({
    name: 'afternoonRoutine',
    initialState: initialAuthState,
    reducers: {
        setAfternoonRoutine(state, action) {
            state.afternoonRoutineList = action.payload
        },
        setSelectedAfternoonRoutines(state, action) {
            state.selectedAfternoonRoutines = action.payload
        }
    }
})
export const afternoonRoutineActions = afternoonRoutineSlice.actions

export default afternoonRoutineSlice.reducer