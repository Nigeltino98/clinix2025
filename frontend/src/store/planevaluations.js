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
    console.log("Fetching evaluations for plan ID:", planId);

    getApi(
        (response) => {
            console.log("API Response:", response);

            if (response && response.data) {
                console.log("Evaluation data being dispatched:", response.data);
                dispatch(
                    planEvaluationActions.setEvaluationList(response.data)
                );
            } else {
                console.error("Unexpected response format:", response);
            }
        },
        token,
        `/api/support-plan/${planId}/evaluations/`
    );
};

export const addPlanEvaluationRequest = (
    token,
    planId,
    evaluation,
    onSuccess,
    onError
) => {
    return async (dispatch) => {
        try {
            postApi(
                (response) => {
                    dispatch(
                        planEvaluationActions.addEvaluation(response.data)
                    );

                    onSuccess(response);
                },
                token,
                `/api/support-plan/${planId}/evaluations/`,
                evaluation,
                (errors_list) => {
                    dispatch(
                        planEvaluationActions.setErrors(errors_list)
                    );

                    onError(errors_list);
                }
            );
        } catch (error) {
            console.error('Error adding plan evaluation:', error);

            dispatch(
                planEvaluationActions.setErrors({
                    postError: 'Failed to add evaluation'
                })
            );

            onError([
                {
                    message:
                        'Failed to add plan evaluation. Please try again.'
                }
            ]);
        }
    };
};

export const planEvaluationActions = { ...planEvaluationSlice.actions, fetchPlanEvaluations, addPlanEvaluationRequest };
export default planEvaluationSlice.reducer;
