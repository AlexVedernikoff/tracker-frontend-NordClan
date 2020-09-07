import * as TagsActions from '../constants/Tags';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { projectIdSelector } from '../selectors/Project';
import { langSelector } from '../selectors/Localize';
import get from 'lodash/get';

import localize from './Tags.i18n.json';

const startTagsCreate = () => ({
  type: TagsActions.TAGS_CREATE_START
});

const tagsCreateSucces = tags => ({
  type: TagsActions.TAGS_CREATE_SUCCESS,
  data: tags
});

const tagsCreateError = err => ({
  type: TagsActions.TAGS_CREATE_ERROR,
  error: err
});

const startTagsDelete = () => ({
  type: TagsActions.TAGS_DELETE_START
});

const tagsDeleteSuccess = data => ({
  type: TagsActions.TAGS_DELETE_SUCCESS,
  data
});

const tagsDeleteError = err => ({
  type: TagsActions.TAGS_DELETE_ERROR,
  error: err
});

const startTagsFilter = () => ({
  type: TagsActions.GET_TAGS_FILTER_START
});

const TagsFilterSucces = tags => ({
  type: TagsActions.GET_TAGS_FILTER_SUCCESS,
  data: tags
});

const TagsFilterError = err => ({
  type: TagsActions.GET_TAGS_FILTER_ERROR,
  error: err
});

export const createTags = (tags, taggable, taggableId) => {
  const URL = `${API_URL}/${taggable}/${taggableId}/tag`;
  return (dispatch, getState) => {
    dispatch(startTagsCreate());
    dispatch(startLoading());
    axios
      .post(URL, {
        tag: tags,
        taggable: taggable,
        taggableId: taggableId
      })
      .then(res => {
        if (!res.data) return;

        dispatch(
          tagsCreateSucces({
            taggableId: taggableId,
            tags: res.data
          })
        );
      })
      .catch(error => {
        const lang = langSelector(getState());
        let message = localize[lang].TAG_CREATE_ERROR;

        if (error.response.status === 400) {
          // lodash.get is used just in case api validation error handling changes
          const errors = get(error.response.data, 'message.errors', []);
          const isTagLengthError = errors.some(({ param }) => param === 'tag');

          if (isTagLengthError) {
            message = localize[lang].TAG_NAME_LENGTH_ERROR;
          }
        }

        dispatch(showNotification({ message, type: 'error' }));
        dispatch(tagsCreateError(error));
      })
      .finally(() => dispatch(finishLoading()));
  };
};

export const deleteTag = (tag, taggable, taggableId) => {
  const URL = `${API_URL}/${taggable}/${taggableId}/tag/${tag}`;
  return dispatch => {
    dispatch(startTagsDelete());
    dispatch(startLoading());
    axios
      .delete(URL)
      .then(() => {
        dispatch(tagsDeleteSuccess({ tag }));
      })
      .catch(error => {
        dispatch(tagsDeleteError(error));
      })
      .finally(() => dispatch(finishLoading()));
  };
};

export const getTagsFilter = (tagName, filterFor) => {
  return (dispatch, getState) => {
    dispatch(startTagsFilter());
    dispatch(startLoading());

    let requestedTagsList;
    if (filterFor === 'task') {
      const projectId = projectIdSelector(getState());
      requestedTagsList = axios
        .get(`${API_URL}/project/${projectId}/tags`, { params: { tagName } }, { withCredentials: true })
        .then(response => response.data.map(o => o.name));
    } else {
      requestedTagsList = axios
        .get(`${API_URL}/${filterFor}/tag`, { params: { tagName } }, { withCredentials: true })
        .then(response => response.data);
    }

    return requestedTagsList
      .then(data => {
        if (!data) return;

        dispatch(
          TagsFilterSucces({
            filteredTags: data,
            filterFor: filterFor
          })
        );
      })
      .catch(error => {
        dispatch(showNotification({ message: error.message, type: 'error' }));
        dispatch(
          TagsFilterError({
            error: error
          })
        );
      })
      .finally(() => dispatch(finishLoading()));
  };
};
