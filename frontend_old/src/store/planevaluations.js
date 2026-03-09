import { createSlice } from '@reduxjs/toolkit';
import { getApi, postApi } from '../api/api';

const initialEvaluationState = {
  evaluationList: [],
  selectedEvaluation: {},
  errors: {},
};

const planEvaluationSlice = createSlice({
  name: 'planEvaluation',
  initialState: initialEvaluationState,
  reducers: {
    setEvaluationList(state, action) {
      state.evaluationList = action.payload;
    },
    setSelectedEvaluation(state, action) {
      state.selectedEvaluation = action.payload;
    },
    addEvaluation(state, action) {
      state.evaluationList.push(action.payload);
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
  },
});

export const fetchPlanEvaluations = (token, planId) => async (dispatch) => {
    try {
        console.log("Fetching evaluations for plan ID:", planId);
        const response = await getApi(token, `/api/support-plan/${planId}/evaluations`);

        console.log("API Response:", response);

        if (response && response.data) {
            dispatch({
                type: 'FETCH_PLAN_EVALUATIONS_SUCCESS',
                payload: response.data,
            });
        } else {
            console.error("Unexpected response format:", response);
            // Handle unexpected response format
        }
    } catch (error) {
        console.error("Error fetching plan evaluations:", error);
        // Handle error properly
    }
};


export const addPlanEvaluationRequest = (token, planId, evaluation, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const response = await postApi(
        (response) => {
          dispatch(planEvaluationActions.addEvaluation(response.data));
          onSuccess(response);
        },
        token,
        `/api/support-plan/${planId}/evaluations/`,
        evaluation,
        (errors_list) => {
          dispatch(planEvaluationActions.setErrors(errors_list));
          onError(errors_list);
        }
      );
    } catch (error) {
      console.error('Error adding plan evaluation:', error);
      dispatch(planEvaluationActions.setErrors({ postError: 'Failed to add evaluation' }));
      onError([{ message: 'Failed to add plan evaluation. Please try again.' }]);
    }
  };
};

export const planEvaluationActions = { ...planEvaluationSlice.actions, fetchPlanEvaluations, addPlanEvaluationRequest };
export default planEvaluationSlice.reducer;
