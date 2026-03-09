import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { bodymapList: [], selectedBodyMap: {}, selectedBodyMapList: [] }

const bodymapSlice = createSlice({
    name: 'bodymap',
    initialState: initialAuthState,
    reducers: {
        setBodyMaps(state, action) {
            state.bodymapList = action.payload
        },
        setSelectedBodyMap(state, action) {
            state.selectedBodyMap = action.payload
        },
        setSelectedBodyMapList(state, action) {
            state.selectedBodyMapList = action.payload
        },

    }
})
export const bodymapActions = bodymapSlice.actions

export default bodymapSlice.reducer
