import * as MilestoneActions from '../constants/Milestone';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const createMilestoneRequest = () => ({
  type: MilestoneActions.MILESTONE_CREATE_REQUEST
});

const createMilestoneSuccess = milestone => ({
  type: MilestoneActions.MILESTONE_CREATE_SUCCESS,
  milestone
});

const createMilestoneFailure = () => ({
  type: MilestoneActions.MILESTONE_CREATE_FAILURE
});

const editMilestoneRequest = () => ({
  type: MilestoneActions.MILESTONE_EDIT_REQUEST
});

const editMilestoneSuccess = milestone => ({
  type: MilestoneActions.MILESTONE_EDIT_SUCCESS,
  milestone
});

const editMilestoneFailure = () => ({
  type: MilestoneActions.MILESTONE_EDIT_FAILURE
});

const deleteMilestoneRequest = () => ({
  type: MilestoneActions.MILESTONE_DELETE_REQUEST
});

const deleteMilestoneSuccess = id => ({
  type: MilestoneActions.MILESTONE_DELETE_SUCCESS,
  id
});

const deleteMilestoneFailure = () => ({
  type: MilestoneActions.MILESTONE_DELETE_FAILURE
});

export const createMilestone = (name, projectId, date) => {
  const URL = `${API_URL}/milestones/`;

  return dispatch => {
    dispatch(createMilestoneRequest());
    dispatch(startLoading());
    axios
      .post(URL, {
        name,
        projectId,
        date
      })
      .then(
        response => {
          if (response.data) {
            dispatch(createMilestoneSuccess(response.data));
            dispatch(finishLoading());
          }
        },
        error => {
          dispatch(createMilestoneFailure());
          dispatch(showNotification({ message: error.message, type: 'error' }));
          dispatch(finishLoading());
        }
      );
  };
};

export const editMilestone = milestone => {
  const URL = `${API_URL}/milestones/${milestone.id}`;

  return dispatch => {
    dispatch(editMilestoneRequest());
    dispatch(startLoading());
    axios.put(URL, milestone).then(
      response => {
        if (response.data) {
          dispatch(editMilestoneSuccess(response.data));
          dispatch(finishLoading());
        }
      },
      error => {
        dispatch(editMilestoneFailure());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      }
    );
  };
};

export const deleteMilestone = id => {
  const URL = `${API_URL}/milestones/${id}`;

  return dispatch => {
    dispatch(deleteMilestoneRequest());
    dispatch(startLoading());
    axios.delete(URL, id).then(
      () => {
        dispatch(deleteMilestoneSuccess(id));
        dispatch(finishLoading());
      },
      error => {
        dispatch(deleteMilestoneFailure());
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      }
    );
  };
};
