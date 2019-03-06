import * as GoalsActions from '../constants/Goals';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { getProjectInfo } from './Project';

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

export const create = data => {
  const URL = `${API_URL}/goal`;
  return dispatch => {
    dispatch({ type: GoalsActions.CREATE_GOAL_START });
    axios
      .post(URL, data)
      .then(response => {
        dispatch({ type: GoalsActions.CREATE_GOAL, data: response.data });
        dispatch(getProjectInfo(data.projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};

export const edit = data => {
  const URL = `${API_URL}/goal/${data.sprintId}`;
  return dispatch => {
    dispatch({ type: GoalsActions.EDIT_GOAL_START });
    axios
      .put(URL, data)
      .then(response => {
        dispatch({ type: GoalsActions.EDIT__GOAL, data: response.data });
        dispatch(getProjectInfo(data.projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};

export const remove = (id, projectId) => {
  const URL = `${API_URL}/goal/${id}`;
  return dispatch => {
    dispatch({ type: GoalsActions.REMOVE_GOAL_START });
    axios
      .delete(URL)
      .then(response => {
        dispatch({ type: GoalsActions.REMOVE__GOAL, data: response.data });
        dispatch(getProjectInfo(projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};

export const transfer = (gloalId, sprintId, projectId) => {
  const URL = `${API_URL}/goal/${gloalId}/sprint`;
  return dispatch => {
    dispatch({ type: GoalsActions.TRANSGER_GOAL_START });
    axios
      .put(URL, { sprintId })
      .then(response => {
        dispatch({ type: GoalsActions.TRANSGER__GOAL, data: response.data });
        dispatch(getProjectInfo(projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};

export const toggleVisible = (gloalId, visible, projectId) => {
  const URL = `${API_URL}/goal/${gloalId}/visible`;
  return dispatch => {
    dispatch({ type: GoalsActions.TOGGLE_VISIBLE_GOAL_START });
    axios
      .put(URL, { visible })
      .then(response => {
        dispatch({ type: GoalsActions.TOGGLE_VISIBLE_GOAL_SUCCESS, data: response.data });
        dispatch(getProjectInfo(projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};

export const toggleStatus = (gloalId, status, projectId) => {
  const URL = `${API_URL}/goal/${gloalId}/status`;
  return dispatch => {
    dispatch({ type: GoalsActions.TOGGLE_STATUS_GOAL_START });
    axios
      .put(URL, { status })
      .then(response => {
        dispatch({ type: GoalsActions.TOGGLE_STATUS_GOAL_SUCCES, data: response.data });
        dispatch(getProjectInfo(projectId));
      })
      .catch(error => dispatch(showNotification({ message: error.message, type: 'error' })));
  };
};
