import * as SprintActions from '../constants/Sprint';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { store } from '../History';

let lang = 'en';
store.subscribe(() => {
  lang = store.getState().Localize.lang;
});

const sprintHasActiveTasksRu = 'В спринте есть активные задачи. Удаление невозможно';
const sprintHasActiveTasksEn = 'There are active tasks in the sprint. Unable to delete';

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

export const editSprint = (id, statusId, name, dateForm, dateTo, budget, riskBudget, qaPercent) => {
  const URL = `${API_URL}/sprint/${id}`;
  const params = {};
  if (name) params.name = name;
  if (dateForm) params.factStartDate = dateForm;
  if (dateTo) params.factFinishDate = dateTo;
  if (statusId) params.statusId = statusId;
  if (budget || budget === 0) params.budget = budget;
  if (riskBudget || riskBudget === 0) params.riskBudget = riskBudget;
  if (qaPercent || qaPercent === 0) params.qaPercent = qaPercent;

  return dispatch => {
    if (!id || !(statusId || name || dateForm || dateTo || qaPercent || budget || riskBudget)) {
      return;
    }
    dispatch(editSprintStart());
    dispatch(startLoading());
    axios.put(URL, params).then(
      response => {
        if (response.data) {
          dispatch(editSprintSuccess(response.data));
        }
        dispatch(finishLoading());
      },
      error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      }
    );
  };
};

export const deleteSprint = id => {
  const URL = `${API_URL}/sprint/${id}`;

  return dispatch => {
    dispatch(deleteSprintStart());
    dispatch(startLoading());
    axios.delete(URL).then(
      response => {
        if (response.data) {
          dispatch(deleteSprintSuccess(response.data));
        }
        dispatch(finishLoading());
      },
      error => {
        if (error.response.data.type === 'sprintHasActiveTasks') {
          dispatch(
            showNotification({
              message: lang === 'en' ? sprintHasActiveTasksEn : sprintHasActiveTasksRu,
              type: 'error'
            })
          );
        } else {
          dispatch(showNotification({ message: error.message, type: 'error' }));
        }
        dispatch(finishLoading());
      }
    );
  };
};

export const createSprint = (name, projectId, factStartDate, factFinishDate, qaPercent, budget, riskBudget) => {
  const URL = `${API_URL}/sprint/`;
  return dispatch => {
    dispatch(createSprintStart());
    dispatch(startLoading());
    axios
      .post(URL, {
        name,
        projectId,
        qaPercent,
        factStartDate,
        factFinishDate,
        budget,
        riskBudget
      })
      .then(
        response => {
          if (response.data) {
            dispatch(createSprintSuccess(response.data.sprints));
          }
          dispatch(finishLoading());
        },
        error => {
          dispatch(showNotification({ message: error.message, type: 'error' }));
          dispatch(finishLoading());
        }
      );
  };
};
