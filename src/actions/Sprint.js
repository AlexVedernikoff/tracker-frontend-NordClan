import * as SprintActions from '../constants/Sprint';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

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

export const editSprint = (id, statusId, name, dateForm, dateTo) => {
  const URL = `/api/sprint/${id}`;
  const params = {};
  if (name) params.name = name;
  if (dateForm) params.factStartDate = dateForm;
  if (dateTo) params.factFinishDate = dateTo;
  if (statusId) params.statusId = statusId;

  return dispatch => {
    if (!id || !(statusId || name || dateForm || dateTo)) {
      return;
    }
    dispatch(editSprintStart());
    dispatch(StartLoading());
    axios.put(URL, params)
      .then(response => {
        if (response.data) {
          dispatch(editSprintSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export const deleteSprint = (id) => {
  const URL = `/api/sprint/${id}`;

  return dispatch => {
    dispatch(deleteSprintStart());
    dispatch(StartLoading());
    axios.delete(URL)
      .then(response => {
        if (response.data) {
          dispatch(deleteSprintSuccess(response.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export const createSprint = (name, id, dateForm, dateTo) => {
  const URL = '/api/sprint/';

  return dispatch => {
    dispatch(createSprintStart());
    dispatch(StartLoading());
    axios.post(URL, {
      name: name,
      projectId: id,
      factStartDate: dateForm,
      factFinishDate: dateTo
    })
      .then(response => {
        if (response.data) {
          dispatch(createSprintSuccess(response.data.sprints));
          dispatch(FinishLoading());
        }
      });
  };
};
