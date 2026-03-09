import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { noteList: [], selectedNote: {} }

const noteSlice = createSlice({
    name: 'note',
    initialState: initialAuthState,
    reducers: {
        setNote(state, action) {
            state.noteList = action.payload
        },
        setSelectedNote(state, action) {
            state.selectedNote = action.payload
        },
        setDeletedNotes(state, action) {
            state.deletedNotes = action.payload
        },
    }
})
export const noteActions = noteSlice.actions

export default noteSlice.reducer