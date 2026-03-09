import { createSlice } from '@reduxjs/toolkit'

const initialAuthState = { attachmentList: [], selectedAttachment: {}, selectedAttachmentList: [] }

const attachmentSlice = createSlice({
    name: 'attachment',
    initialState: initialAuthState,
    reducers: {
        setAttachments(state, action) {
            state.attachmentList = action.payload
        },
        setSelectedAttachment(state, action) {
            state.selectedAttachment = action.payload
        },
        setSelectedAttachmentList(state, action) {
            state.selectedAttachmentList = action.payload
        },

    }
})
export const attachmentActions = attachmentSlice.actions

export default attachmentSlice.reducer
