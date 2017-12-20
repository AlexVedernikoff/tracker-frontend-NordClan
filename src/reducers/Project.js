import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';
import * as SprintActions from '../constants/Sprint';
import * as TasksActions from '../constants/Tasks';

const InitialState = {
  project: {
    sprints: [],
    users: [],
    history: {
      events: [],
      pagesCount: 0
    },
    error: false,
    metrics: []
  },
  TitleIsEditing: false,
  DescriptionIsEditing: false,
  isCreateTaskModalOpen: false,
  PortfolioIsEditing: false,
  isProjectInfoReceiving: false,
  isCreateTaskRequestInProgress: false
};

export default function Project (state = InitialState, action) {
  switch (action.type) {
  case ProjectActions.BIND_USER_TO_PROJECT_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        users: action.users
      }
    };
  case ProjectActions.UNBIND_USER_TO_PROJECT_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        users: action.users
      }
    };
  case SprintActions.SPRINTS_EDIT_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        sprints: action.sprints
      }
    };

  case SprintActions.SPRINTS_CREATE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        sprints: action.sprints
      }
    };

  case SprintActions.SPRINTS_DELETE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        sprints: action.sprints
      }
    };

  case TagsActions.TAGS_DELETE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        tags: action.data.tags
      }
    };

  case TagsActions.TAGS_CREATE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        tags: action.data.tags
      }
    };

  case ProjectActions.PROJECT_INFO_RECEIVE_START:
    return {
      ...state,
      isProjectInfoReceiving: true
    };

  case ProjectActions.PROJECT_INFO_RECEIVE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        ...action.project
      },
      isProjectInfoReceiving: false
    };

  case ProjectActions.PROJECT_INFO_RECEIVE_FAIL:
    return {
      ...state,
      project: {
        ...state.project,
        error: action.error
      },
      isProjectInfoReceiving: false
    };

  case ProjectActions.PROJECT_USERS_RECEIVE_START:
    return {
      ...state
    };

  case ProjectActions.PROJECT_USERS_RECEIVE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        users: action.users
      }
    };

  case ProjectActions.PROJECT_SPRINTS_RECEIVE_START:
    return {
      ...state
    };

  case ProjectActions.PROJECT_SPRINTS_RECEIVE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        sprints: action.sprints
      }
    };

  case ProjectActions.PROJECT_CHANGE_START:
    return {
      ...state
    };

  case ProjectActions.PROJECT_CHANGE_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        ...action.changedFields
      }
    };

  case ProjectActions.EDIT_START:
    return {
      ...state,
      [`${action.target}IsEditing`]: true
    };

  case ProjectActions.EDIT_FINISH:
    return {
      ...state,
      [`${action.target}IsEditing`]: false
    };

  case ProjectActions.OPEN_CREATE_TASK_MODAL:
    return {
      ...state,
      isCreateTaskModalOpen: true
    };

  case ProjectActions.CLOSE_CREATE_TASK_MODAL:
    return {
      ...state,
      isCreateTaskModalOpen: false
    };

  case ProjectActions.TASK_CREATE_REQUEST_START:
    return {
      ...state,
      isCreateTaskRequestInProgress: true
    };
  case ProjectActions.TASK_CREATE_REQUEST_SUCCESS:
    return {
      ...state,
      lastCreatedTask: {
        projectId: action.projectId,
        sprintId: action.sprintId,
        taskId: action.taskId
      },
      isCreateTaskRequestInProgress: false
    };
  case ProjectActions.TASK_CREATE_REQUEST_ERROR:
    return {
      ...state,
      isCreateTaskRequestInProgress: false
    };
  case ProjectActions.UPDATE_PROJECT_STATUS_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        updatedStatusId: action.updatedStatusId
      }
    };

  case ProjectActions.GET_PROJECT_HISTORY_REQUEST_SENT:
    return {
      ...state,
      project: {
        ...state.project,
        history: {
          events: [],
          pagesCount: 0
        }
      }
    };

  case ProjectActions.GET_PROJECT_HISTORY_REQUEST_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        history: {
          events: action.data.data,
          pagesCount: action.data.pagesCount
        }
      }
    };

  case ProjectActions.OPEN_SET_PORTFOLIO_MODAL:
    return {
      ...state,
      PortfolioIsEditing: true
    };

  case ProjectActions.CLOSE_SET_PORTFOLIO_MODAL:
    return {
      ...state,
      PortfolioIsEditing: false
    };

  case TasksActions.CLEAR_CURRENT_PROJECT_AND_TASKS:
    return {
      project: {
        sprints: [],
        users: [],
        history: {},
        error: false
      },
      TitleIsEditing: false,
      DescriptionIsEditing: false,
      isCreateTaskModalOpen: false
    };

  case ProjectActions.PROJECT_ATTACHMENT_REMOVE_SUCCESS: {
    const { attachmentId } = action;
    const { attachments } = state.project.attachments;
    const newAttachments = attachments.map(attach =>
      ({ ...attach, deleting: attach.id === attachmentId || attach.deleting })
    );

    return {
      ...state,
      project: {
        ...state.project,
        attachments: newAttachments
      }
    };
  };

  case ProjectActions.PROJECT_ATTACHMENT_UPLOAD_REQUEST: {
    const attachments = state.project.attachments;
    const attachment = action.attachment;

    return {
      ...state,
      project: {
        ...state.project,
        attachments: [
          ...attachments,
          {
            ...attachment,
            uploading: true
          }
        ]
      }
    };
  }

  case ProjectActions.PROJECT_ATTACHMENT_UPLOAD_PROGRESS: {
    const attachments = state.project.attachments.map((attachment) => {
      if (attachment.id === action.attachment.id) {
        attachment.progress = action.progress;
      }

      return attachment;
    });

    return {
      ...state,
      project: {
        ...state.project,
        attachments
      }
    };
  }

  case ProjectActions.PROJECT_ATTACHMENT_UPLOAD_SUCCESS: {
    const attachments = state.project.attachments.filter(
      value => value.uploading && value.id !== action.attachment.id
    );

    return {
      ...state,
      project: {
        ...state.project,
        attachments: [
          ...action.result.data,
          ...attachments
        ]
      }
    };
  }

  case ProjectActions.GET_METRICS_SUCCESS:
    return {
      ...state,
      project: {
        ...state.project,
        metrics: action.metrics
      }
    }
  default:
    return {
      ...state
    };
  }
}
