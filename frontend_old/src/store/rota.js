import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { rotaList: [], selectedRota:{}}

const rotaSlice = createSlice({
    name: 'rota',
    initialState: initialAuthState,
    reducers: {
        setRota(state, action) {
            state.rotaList = action.payload
        },
        setSelectedRotas(state, action) {
            state.selectedRota = action.payload
        }
    }
})
export const rotaActions = rotaSlice.actions

export default rotaSlice.reducer