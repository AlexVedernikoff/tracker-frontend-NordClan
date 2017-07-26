import * as TagsActions from '../constants/Tags';
import { API_URL } from '../constants/Settings';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { store } from '../Router';
import { history } from '../Router';

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

export const createTags = (tags,
                           taggable,
                           taggableId) => {
  const URL = `${API_URL}/${taggable}/${taggableId}/tag`;
  return dispatch => {
    dispatch(startTagsCreate());
    dispatch(startLoading());
    axios.post(URL, {
      tag: tags
    })
      .then(res => {
        if (!res.data) return;

        dispatch(tagsCreateSucces({
          taggableId: taggableId,
          tags: res.data
        }));
        dispatch(finishLoading());
      });
  };
};

export const deleteTag = (tag,
                          taggable,
                          taggableId) => {
  const URL = `${API_URL}/${taggable}/${taggableId}/tag/${tag}`;
  return dispatch => {
    dispatch(startTagsDelete());
    dispatch(startLoading());
    axios.delete(URL)
      .then(res => {
        if (!res.data) return;

        dispatch(tagsDeleteSucces({
          taggableId: taggableId,
          tags: res.data
        })
      );
        dispatch(finishLoading());
      });
  };
};
