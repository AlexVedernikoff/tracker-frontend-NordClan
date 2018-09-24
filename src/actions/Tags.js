import * as TagsActions from '../constants/Tags';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

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

const tagsDeleteSucces = tags => ({
  type: TagsActions.TAGS_DELETE_SUCCESS,
  data: tags
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
  return dispatch => {
    dispatch(startTagsCreate());
    dispatch(startLoading());
    axios
      .post(URL, {
        tag: tags,
        taggable: taggable,
        taggableId: taggableId
      })
      .then(res => {
        dispatch(finishLoading());
        if (!res.data) return;

        dispatch(
          tagsCreateSucces({
            taggableId: taggableId,
            tags: res.data
          })
        );
      });
  };
};

export const deleteTag = (tag, taggable, taggableId) => {
  const URL = `${API_URL}/${taggable}/${taggableId}/tag/${tag}`;
  return dispatch => {
    dispatch(startTagsDelete());
    dispatch(startLoading());
    axios.delete(URL).then(res => {
      dispatch(finishLoading());
      if (!res.data) return;

      dispatch(
        tagsDeleteSucces({
          taggableId: taggableId,
          tags: res.data
        })
      );
    });
  };
};

export const getTagsFilter = (tagName, filterFor) => {
  return dispatch => {
    dispatch(startTagsFilter());
    dispatch(startLoading());
    axios
      .get(`${API_URL}/${filterFor}/tag`, { params: { tagName } }, { withCredentials: true })
      .then(response => {
        dispatch(finishLoading());
        if (!response.data) return;

        dispatch(
          TagsFilterSucces({
            filteredTags: response.data,
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
        dispatch(finishLoading());
      });
  };
};
