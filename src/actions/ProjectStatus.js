import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import * as ProjectActions from '../constants/Project';
import { API_URL } from '../constants/Settings';
import { store } from '../History';

let lang = 'en';
store.subscribe(() => {
  lang = store.getState().Localize.lang;
});

const statusUpdatedEn = 'Status updated';
const statusUpdatedRu = 'Статус обновлен';

const updateProjectStatusStart = () => ({
  type: ProjectActions.UPDATE_PROJECT_STATUS_START
});

const updateProjectStatusSuccess = data => ({
  type: ProjectActions.UPDATE_PROJECT_STATUS_SUCCESS,
  updatedStatusId: data.statusId
});

export const updateProjectStatus = (projectId, statusId) => {
  const url = `${API_URL}/project/${projectId}`;

  return dispatch => {
    dispatch(updateProjectStatusStart());
    dispatch(startLoading());
    axios
      .put(url, { statusId })
      .then(response => {
        if (response.data) {
          dispatch(updateProjectStatusSuccess(response.data));
          dispatch(showNotification({ message: lang === 'en' ? statusUpdatedEn : statusUpdatedRu }));
        }
        dispatch(finishLoading());
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(finishLoading());
      });
  };
};
