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
    },
        { withCredentials: true })
        .then(response => {
          if (response.data) {
            dispatch(createSprintSuccess(response.data.sprints));
            dispatch(FinishLoading());
          }
        });
  };
};
