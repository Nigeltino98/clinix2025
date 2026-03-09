import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { paymentshandoverList: [], selectedPaymentsHandover: {} }

const paymentshandoverSlice = createSlice({
    name: 'paymentshandover',
    initialState: initialAuthState,
    reducers: {
        setPaymentsHandover(state, action) {
            state.paymentshandoverList = action.payload
        },
        setSelectedPaymentsHandover(state, action) {
            state.selectedPaymentsHandover = action.payload
        },
    }
})
export const paymentshandoverActions = paymentshandoverSlice.actions

export default paymentshandoverSlice.reducer