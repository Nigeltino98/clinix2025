// userHistoryActions.js
import { createSlice } from '@reduxjs/toolkit';
import { getApi} from '../api/api';


const initialUserHistoryState = {
      userHistoryList: [],

};

const userHistorySlice = createSlice({
      name: 'userHistory',
      initialState: initialUserHistoryState,
      reducers: {
        setUserHistoryList(state, action) {
          state.userHistoryList = action.payload;
        },
      

      },
 });
 

export const userHistoryActions = userHistorySlice.actions;
export default userHistorySlice.reducer;