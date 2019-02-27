import * as TaskActions from '../constants/Task';
import * as TagsActions from '../constants/Tags';
import * as TaskStatuses from '../constants/TaskStatuses';
import * as _ from 'lodash';

const getDefaultCurrentComment = () => ({
  text: '',
  parentId: null,
  id: null,
  disabled: false,
  expired: false
});

const getJobById = status => {
  switch (status) {
    case TaskStatuses.DEV_PLAY:
    case TaskStatuses.DEV_STOP:
      return 'Develop';
    case TaskStatuses.QA_PLAY:
    case TaskStatuses.QA_STOP:
      return 'QA';
    case TaskStatuses.CODE_REVIEW_STOP:
    case TaskStatuses.CODE_REVIEW_PLAY:
      return 'Code Review';
    default:
      return 'Another';
  }
};

const InitialState = {
  task: {
    tags: [],
    error: false,
    attachments: [],
    branches: [],
    plannedExecutionTime: '0.00'
  },
  comments: [],
  history: {},
  timeSpent: {},
  currentComment: getDefaultCurrentComment(),
  highlighted: {},
  TitleIsEditing: false,
  PlanningTimeIsEditing: false,
  ExecutionTimeIsEditing: false,
  SprintIsEditing: false,
  StatusIsEditing: false,
  DescriptionIsEditing: false,
  PriorityIsEditing: false,
  isUploadingAttachment: false
};

export default function Task(state = InitialState, action) {
  switch (action.type) {
    case TagsActions.TAGS_DELETE_SUCCESS:
      return {
        ...state,
        task: {
          ...state.task,
          tags: state.task.tags.filter(tag => (tag.name || tag) !== action.data.tag)
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
        PlanningTimeIsEditing: false
      };

    case TaskActions.GET_TASK_REQUEST_SUCCESS:
      return {
        ...state,
        task: {
          ...state.task,
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
        history: {}
      };

    case TaskActions.GET_TASK_HISTORY_REQUEST_SUCCESS:
      return {
        ...state,
        history: action.data
      };

    case TaskActions.GET_TASK_SPENT_REQUEST_SENT:
      return {
        ...state,
        timeSpent: {}
      };

    case TaskActions.GET_TASK_SPENT_REQUEST_SUCCESS:
      return {
        ...state,
        timeSpent: _.chain(action.data)
          .filter(timeSheet => Number(timeSheet.spentTime))
          .map(spent => ({
            job: getJobById(spent.taskStatusId),
            spent: spent.spentTime
          }))
          .transform((byStatus, spent) => {
            const job = spent.job;
            byStatus[job] = Number(spent.spent) + (byStatus[job] ? byStatus[job] : 0);
          }, {})
          .value(),
        userTimeSpent: _.chain(action.data)
          .filter(timeSheet => Number(timeSheet.spentTime))
          .map(spent => ({
            user: spent.user.fullNameRu,
            spent: spent.spentTime
          }))
          .transform((byStatus, spent) => {
            const user = spent.user;
            byStatus[user] = Number(spent.spent) + (byStatus[user] ? byStatus[user] : 0);
          }, {})
          .value(),
        roleTimeSpent: _.chain(action.data)
          .filter(timeSheet => Number(timeSheet.spentTime))
          .map(spent => ({
            role: spent.userRole,
            spent: spent.spentTime
          }))
          .transform((byStatus, spent) => {
            const role = spent.role;
            byStatus[role] = Number(spent.spent) + (byStatus[role] ? byStatus[role] : 0);
          }, {})
          .value()
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
      let taskArray = [];
      let paramKey;
      let updatedTaskIndex;
      const { changedFields } = action;
      if (
        (Array.isArray(state.task.linkedTasks) &&
          state.task.linkedTasks.find((linkedTask, index) => {
            if (linkedTask.id === changedFields.id) {
              updatedTaskIndex = index;
              return true;
            }
            return false;
          })) ||
        (Array.isArray(changedFields.linkedTasks) && changedFields.linkedTasks.find(link => link.id === state.task.id))
      ) {
        paramKey = 'linkedTasks';
      }

      if (
        (Array.isArray(state.task.subTasks) &&
          state.task.subTasks.find((subTask, index) => {
            if (subTask.id === changedFields.id) {
              updatedTaskIndex = index;
              return true;
            }
            return false;
          })) ||
        changedFields.parentId === state.task.id
      ) {
        paramKey = 'subTasks';
      }
      if (paramKey) {
        if (updatedTaskIndex === undefined) {
          taskArray = [changedFields, ...state.task[paramKey]];
        } else {
          taskArray = [
            ...state.task[paramKey].slice(0, updatedTaskIndex),
            changedFields,
            ...state.task[paramKey].slice(updatedTaskIndex + 1)
          ];
        }
      } else {
        taskArray = state.task.linkedTasks;
      }
      if (state.task.id === changedFields.id) {
        return {
          ...state,
          hasError: false,
          task: {
            ...state.task,
            ...changedFields,
            [paramKey]: taskArray
          },
          lastUpdatedTask: changedFields
        };
      } else {
        return {
          ...state,
          task: {
            ...state.task,
            [paramKey]: taskArray
          },
          lastUpdatedTask: changedFields
        };
      }
    case TaskActions.ERROR_CLEAR:
      return {
        ...state,
        closeHasError: action.closeHasError,
        hasError: false
      };
    case TaskActions.TASK_CHANGE_REQUEST_FAIL:
      return {
        ...state,
        closeHasError: action.closeHasError,
        hasError: true
      };
    case TaskActions.TASK_CHANGE_USER_SENT:
      return {
        ...state
      };
    case TaskActions.CLEAR_CURRENT_TASK:
      return {
        ...InitialState
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

    case TaskActions.GET_COMMENTS_BY_TASK_REQUEST: {
      return {
        ...state,
        isCommentsReceived: false
      };
    }

    case TaskActions.GET_COMMENTS_BY_TASK_SUCCESS: {
      return {
        ...state,
        commentsLoadedDate: action.result.headers.date,
        comments: action.result.data.reverse(),
        isCommentsReceived: true
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
      const index = comments.findIndex(comment => comment.id === commentId);

      comments = [...comments];
      if (currentComment.id === commentId) {
        currentComment = getDefaultCurrentComment();
      } else if (currentComment.parentId === commentId) {
        currentComment = {
          ...currentComment,
          parentId: null
        };
      }
      comments[index] = {
        ...comments[index],
        deleting: true
      };
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

    case TaskActions.TASK_ATTACHMENT_REMOVE_SUCCESS: {
      const { attachmentId } = action;
      const { attachments } = state.task;

      const attachment = attachments.filter(attach => attach.id === attachmentId)[0];
      attachment.deleting = true;

      return {
        ...state,
        task: {
          ...state.task,
          attachments
        }
      };
    }

    case TaskActions.TASK_ATTACHMENT_UPLOAD_REQUEST: {
      const attachments = state.task.attachments;
      const attachment = action.attachment;

      return {
        ...state,
        isUploadingAttachment: true,
        task: {
          ...state.task,
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

    case TaskActions.TASK_ATTACHMENT_UPLOAD_PROGRESS: {
      const attachments = state.task.attachments.map(attachment => {
        if (attachment.id === action.attachment.id) {
          attachment.progress = action.progress;
        }

        return attachment;
      });

      return {
        ...state,
        task: {
          ...state.task,
          attachments
        }
      };
    }

    case TaskActions.TASK_ATTACHMENT_UPLOAD_SUCCESS: {
      const attachments = state.task.attachments.filter(value => value.uploading && value.id !== action.attachment.id);

      return {
        ...state,
        isUploadingAttachment: false,
        task: {
          ...state.task,
          attachments: [...action.result.data, ...attachments]
        }
      };
    }

    case TaskActions.TASK_ATTACHMENT_UPLOAD_FAIL: {
      return {
        ...state,
        isUploadingAttachment: false
      };
    }

    case TaskActions.GET_GITLAB_BRANCHES_SUCCESS: {
      return {
        ...state,
        task: {
          ...state.task,
          branches: [...action.branches]
        }
      };
    }

    case TaskActions.GET_GITLAB_BRANCHES_BY_REPO_SUCCESS: {
      let branchNames = [];
      if (action.repoBranches.length !== 0) {
        branchNames = action.repoBranches.map(b => {
          return { value: b.name, label: b.name };
        });
      }
      return {
        ...state,
        task: {
          ...state.task,
          repoBranches: [...branchNames]
        }
      };
    }

    case TaskActions.CREATE_GITLAB_BRANCH_SUCCESS: {
      return {
        ...state,
        task: {
          ...state.task,
          branches: [...state.task.branches, action.createdGitlabBranch]
        }
      };
    }
    case TaskActions.GET_PROJECT_REPOS_SUCCESS: {
      const repos = action.projectRepos.map(pr => {
        return { value: pr.id, label: pr.name_with_namespace };
      });
      return {
        ...state,
        task: {
          ...state.task,
          projectRepos: [...repos]
        }
      };
    }

    default:
      return state;
  }
}
