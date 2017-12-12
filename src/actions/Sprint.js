import * as SprintActions from '../constants/Sprint';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import moment from 'moment';

const createSprintStart = () => ({
  type: SprintActions.SPRINTS_CREATE_START
});

const createSprintSuccess = sprints => ({
  type: SprintActions.SPRINTS_CREATE_SUCCESS,
  sprints: sprints
});

const deleteSprintStart = () => ({
  type: SprintActions.SPRINTS_DELETE_START
});

const deleteSprintSuccess = sprints => ({
  type: SprintActions.SPRINTS_DELETE_SUCCESS,
  sprints: sprints
});

const editSprintStart = () => ({
  type: SprintActions.SPRINTS_EDIT_START
});

const editSprintSuccess = sprints => ({
  type: SprintActions.SPRINTS_EDIT_SUCCESS,
  sprints: sprints
});

export const editSprint = (id, statusId, name, dateForm, dateTo, allottedTime, budget, riskBudget) => {
  const URL = `${API_URL}/sprint/${id}`;
  const params = {};
  if (name) params.name = name;
  if (dateForm) params.factStartDate = dateForm;
  if (dateTo) params.factFinishDate = dateTo;
  if (statusId) params.statusId = statusId;
  if (allottedTime) params.allottedTime = allottedTime;
  if (budget) params.budget = budget;
  if (riskBudget) params.riskBudget = riskBudget;

  return dispatch => {
    if (!id || !(statusId || name || dateForm || dateTo || allottedTime || budget || riskBudget)) {
      return;
    }
    dispatch(editSprintStart());
    dispatch(startLoading());
    axios
      .put(URL, params)
      .then(response => {
        if (response.data) {
          dispatch(editSprintSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export const deleteSprint = (id) => {
  const URL = `${API_URL}/sprint/${id}`;

  return dispatch => {
    dispatch(deleteSprintStart());
    dispatch(startLoading());
    axios
      .delete(URL)
      .then(response => {
        if (response.data) {
          dispatch(deleteSprintSuccess(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export const createSprint = (name, id, dateForm, dateTo, allottedTime, budget, riskBudget) => {
  const URL = `${API_URL}/sprint/`;
  return dispatch => {
    dispatch(createSprintStart());
    dispatch(startLoading());
    axios
      .post(URL, {
        name,
        projectId,
        allottedTime,        
        factStartDate,
        factFinishDate,
        budget,
        riskBudget
      })
      .then(response => {
        if (response.data) {
          dispatch(createSprintSuccess(response.data.sprints));
          dispatch(finishLoading());
        }
      });
  };
};
