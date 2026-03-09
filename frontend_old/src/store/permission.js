import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { permissionList: [], selectedPermissions: [], allPermissions : [] }

const permissionSlice = createSlice({
    name: 'permission',
    initialState: initialAuthState,
    reducers: {
        setPermissions(state, action) {
            state.permissionList = action.payload
        },
        setSelectedPermissions(state, action) {
            state.selectedPermissions = action.payload
        },
        setAllPermissions(state, action) {
            state.allPermissions = action.payload
        }
    }
})
export const permissionActions = permissionSlice.actions

export default permissionSlice.reducer