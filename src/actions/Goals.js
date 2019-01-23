import * as GoalsActions from '../constants/Goals';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startGoalsReceive = () => ({
  type: GoalsActions.GOALS_RECEIVE_START
});

const goalsListReceived = goals => ({
  type: GoalsActions.GOALS_LIST_RECEIVE_SUCCESS,
  data: goals
});

export const getGoalsByProject = projectId => {
  const URL = `${API_URL}/goal`;
  return dispatch => {
    dispatch(startGoalsReceive());
    dispatch(startLoading());
    axios
      .get(
        URL,
        {
          params: {
            projectId
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response) {
          dispatch(goalsListReceived(response.data));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      });
  };
};

export const clearGoals = () => ({
  type: GoalsActions.CLEAR_GOALS
});
