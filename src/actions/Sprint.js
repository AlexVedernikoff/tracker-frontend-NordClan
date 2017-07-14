import * as SprintActions from '../constants/Sprint';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';

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

export const editSprint = (id, statusId, name, dateForm, dateTo, allottedTime) => {
  const URL = `/api/sprint/${id}`;
  const params = {};
  if (name) params.name = name;
  if (dateForm) params.factStartDate = dateForm;
  if (dateTo) params.factFinishDate = dateTo;
  if (statusId) params.statusId = statusId;
  if (allottedTime) params.allottedTime = allottedTime;

  return dispatch => {
    if (!id || !(statusId || name || dateForm || dateTo || allottedTime)) {
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
  const URL = `/api/sprint/${id}`;

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

export const createSprint = (name, id, dateForm, dateTo, allottedTime) => {
  const URL = '/api/sprint/';

  return dispatch => {
    dispatch(createSprintStart());
    dispatch(startLoading());
    axios
      .post(URL, {
        name: name,
        projectId: id,
        factStartDate: dateForm,
        factFinishDate: dateTo,
        allottedTime: allottedTime
      })
      .then(response => {
        if (response.data) {
          dispatch(createSprintSuccess(response.data.sprints));
          dispatch(finishLoading());
        }
      });
  };
};
