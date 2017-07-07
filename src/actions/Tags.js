import * as TagsActions from '../constants/Tags';
import axios from 'axios';
import {StartLoading, FinishLoading} from './Loading';
import {store} from '../Router';
import {history} from '../Router';

const StartTagsCreate = () => ({
  type: TagsActions.TAGS_CREATE_START
});

const TagsCreateSucces = tags => ({
  type: TagsActions.TAGS_CREATE_SUCCESS,
  data: tags
});

const TagsCreateError = err => ({
  type: TagsActions.TAGS_CREATE_ERROR,
  error: err
});

const StartTagsDelete = () => ({
  type: TagsActions.TAGS_DELETE_START
});

const TagsDeleteSucces = tags => ({
  type: TagsActions.TAGS_DELETE_SUCCESS,
  data: tags
});

const TagsDeleteError = err => ({
  type: TagsActions.TAGS_DELETE_ERROR,
  error: err
});

export const CreateTags = (tags,
                           taggable,
                           taggableId) => {
  const URL = '/api/tag';
  return dispatch => {
    dispatch(StartTagsCreate());
    dispatch(StartLoading());
    axios.post(URL, {
      tag: tags,
      taggable: taggable,
      taggableId: taggableId
    })
      .then(res => {
        if (!res.data) return;

        dispatch(TagsCreateSucces({
          taggableId: taggableId,
          tags: res.data
        }));
        dispatch(FinishLoading());
      });
  };
};

export const DeleteTag = (tag,
                          taggable,
                          taggableId) => {
  const URL = `/api/tag/${taggable}/${taggableId}/?tag=${tag}`;
  return dispatch => {
    dispatch(StartTagsDelete());
    dispatch(StartLoading());
    axios.delete(URL)
      .then(res => {
        if (!res.data) return;

        dispatch(TagsDeleteSucces({
          taggableId: taggableId,
          tags: res.data
        }));
        dispatch(FinishLoading());
      });
  };
};
