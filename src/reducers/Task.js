import * as TaskActions from '../constants/Task';
import * as TagsActions from '../constants/Tags';
import TaskList from "../pages/ProjectPage/TaskList/TaskList";

const getDefaultCurrentComment = () => ({
  text: '',
  parentId: null,
  id: null,
  disabled: false,
  expired: false
});

const InitialState = {
  task: {
    tags: [],
    error: false,
    attachments: []
  },
  comments: [],
  history: [],
  currentComment: getDefaultCurrentComment(),
  highlighted: {},
  TitleIsEditing: false,
  PlanningTimeIsEditing: false,
  SprintIsEditing: false,
  StatusIsEditing: false,
  DescriptionIsEditing: false,
  PriorityIsEditing: false
};

export default function Task (state = InitialState, action) {
  switch (action.type) {
  case TagsActions.TAGS_DELETE_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        tags: action.data.tags
      }
    };

  case TagsActions.TAGS_CREATE_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        tags: action.data.tags
      }
    };

  case TaskActions.GET_TASK_REQUEST_SENT:
    return {
      ...state,
      TitleIsEditing: false,
      PlanningTimeIsEditing: false,
      DescriptionIsEditing: false
    };

  case TaskActions.GET_TASK_REQUEST_SUCCESS:
    return {
      ...state,
      task: {
        ...action.data,
        history: state.task.history
      }
    };

  case TaskActions.GET_TASK_REQUEST_FAIL:
    return {
      ...state,
      task: {
        ...state.task,
        error: action.error
      }
    };

  case TaskActions.GET_TASK_HISTORY_REQUEST_SENT:
    return {
      ...state,
      history: []
    };

  case TaskActions.GET_TASK_HISTORY_REQUEST_SUCCESS:
    return {
      ...state,
      history: action.data
    };

  case TaskActions.TASK_EDIT_START:
    return {
      ...state,
      [`${action.target}IsEditing`]: true
    };

  case TaskActions.TASK_EDIT_FINISH:
    return {
      ...state,
      [`${action.target}IsEditing`]: false
    };

  case TaskActions.TASK_CHANGE_REQUEST_SENT:
    return {
      ...state
    };

  case TaskActions.TASK_CHANGE_REQUEST_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        ...action.changedFields
      }
    };

  case TaskActions.TASK_CHANGE_USER_SENT:
    return {
      ...state
    };

  case TaskActions.TASK_CHANGE_USER_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        ...action.changedFields
      }
    };

  case TaskActions.TASK_LINK_SENT:
    return {
      ...state
    };

  case TaskActions.TASK_LINK_SUCCESS:
    return {
      ...state,
      task: {
        ...state.task,
        linkedTasks: action.linkedTasks
      }
    };

  case TaskActions.GET_COMMENTS_BY_TASK_SUCCESS: {
    return {
      ...state,
      comments: action.result.reverse()
    };
  }

  case TaskActions.SET_CURRENT_COMMENT_TEXT: {
    const { text } = action;
    const { currentComment } = state;
    return {
      ...state,
      currentComment: {
        ...currentComment,
        text
      }
    };
  }

  case TaskActions.REMOVE_COMMENT_REQUEST: {
    const { commentId } = action;
    let { comments, currentComment } = state;
    const index = comments.findIndex((comment) => comment.id === commentId);

    comments = [...comments];
    if (currentComment.id === commentId) {
      currentComment = getDefaultCurrentComment();
    } else if (currentComment.parentId === commentId) {
      currentComment = {...currentComment, parentId: null};
    }
    comments[index] = { ...comments[index], deleting: true };
    return {
      ...state,
      comments,
      currentComment
    };
  }

  case TaskActions.UPDATE_COMMENT_REQUEST:
  case TaskActions.PUBLISH_COMMENT_REQUEST: {
    return {
      ...state,
      currentComment: {
        ...state.currentComment,
        disabled: true
      }
    };
  }

  case TaskActions.UPDATE_COMMENT_FAIL:
  case TaskActions.PUBLISH_COMMENT_FAIL: {
    return {
      ...state,
      currentComment: {
        ...state.currentComment,
        disabled: false
      }
    };
  }

  case TaskActions.UPDATE_COMMENT_SUCCESS:
  case TaskActions.PUBLISH_COMMENT_SUCCESS: {
    return {
      ...state,
      currentComment: getDefaultCurrentComment(),
      highlighted: action.result
    };
  }

  case TaskActions.SELECT_COMMENT_FOR_REPLY: {
    const { parentId } = action;
    let { currentComment } = state;
    if (currentComment.id) {
      currentComment = getDefaultCurrentComment();
    }
    return {
      ...state,
      currentComment: {
        ...currentComment,
        parentId
      }
    };
  }

  case TaskActions.SET_COMMENT_FOR_EDIT: {
    const { comment } = action;
    return {
      ...state,
      currentComment: {
        ...getDefaultCurrentComment(),
        ...comment
      }
    };
  }

  case TaskActions.RESET_CURRENT_EDITING_COMMENT: {
    return {
      ...state,
      currentComment: getDefaultCurrentComment()
    };
  }

  case TaskActions.SET_CURRENT_COMMENT_EXPIRED: {
    return {
      ...state,
      currentComment: {
        ...state.currentComment,
        expired: true
      }
    };
  }

  case TaskActions.SET_HIGHLIGHTED_COMMENT: {
    return {
      ...state,
      highlighted: action.comment
    };
  }

  default:
    return state;
  }
}
