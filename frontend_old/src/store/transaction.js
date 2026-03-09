import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { transactionList: [], selectedTransactionList: [], selectedTransaction: {} }

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: initialAuthState,
    reducers: {
        setTransactions(state, action) {
            state.transactionList = action.payload
        },
        setSelectedTransactions(state, action) {
            state.selectedTransactionList = action.payload
        },
        setSelectedTransaction(state, action) {
            state.selectedTransaction = action.payload
        },
    }
})
export const transactionActions = transactionSlice.actions

export default transactionSlice.reducer