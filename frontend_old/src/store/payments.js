import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { paymentList: [], selectedPayment: {} }

const paymentSlice = createSlice({
    name: 'payment',
    initialState: initialAuthState,
    reducers: {
        setPayment(state, action) {
            state.paymentList = action.payload
        },
        setSelectedPayment(state, action) {
            state.selectedPayment = action.payload
        },
    }
})
export const paymentActions = paymentSlice.actions

export default paymentSlice.reducer