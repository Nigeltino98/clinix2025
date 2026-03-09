import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { groupList: [], selectedGroup: {  } }

const groupSlice = createSlice({
    name: 'group',
    initialState: initialAuthState,
    reducers: {
        setGroup(state, action) {
            state.groupList = action.payload
        },
        setSelectedGroup(state, action) {
            state.selectedGroup = action.payload
        },
    }
})
export const groupActions = groupSlice.actions

export default groupSlice.reducer