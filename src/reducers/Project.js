import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';
import * as SprintActions from '../constants/Sprint';
import * as TasksActions from '../constants/Tasks';
import * as MilestoneActions from '../constants/Milestone';
import * as GitlabActions from '../constants/Gitlab';
import * as JiraActions from '../constants/Jira';

const InitialState = {
  project: {
    milestones: [],
    sprints: [],
    users: [],
    externalUsers: [],
    history: {
      events: [],
      pagesCount: 0
    },
    error: false,
    validationError: null,
    metrics: [],
    notProcessedGitlabUsers: [],
    gitlabProjectIds: [],
    authorsTasksUniq: []
  },
  TitleIsEditing: false,
  DescriptionIsEditing: false,
  isCreateTaskModalOpen: false,
  isCreateChildTaskModalOpen: false,
  PortfolioIsEditing: false,
  isProjectInfoReceiving: false,
  isCreateTaskRequestInProgress: false,
  isSprintsReceiving: false
};

export default function Project(state = InitialState, action) {
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

    case ProjectActions.UNBIND_EXTERNAL_USER_TO_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          externalUsers: state.project.externalUsers.filter(item => item.id !== action.userId)
        }
      };

    case SprintActions.SPRINTS_EDIT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          sprints: action.sprints
        },
        isSprintsReceiving: false
      };

    case SprintActions.SPRINTS_EDIT_START:
      return {
        ...state,
        isSprintsReceiving: true
      };

    case SprintActions.SPRINTS_EDIT_FAIL:
      return {
        ...state,
        isSprintsReceiving: false
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
          tags: state.project.tags.filter(tag => (tag.name || tag) !== action.data.tag)
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

    case ProjectActions.PROJECT_TAGS_RECEIVE_START:
      return {
        ...state,
        isProjectTagsReceiving: true
      };

    case ProjectActions.PROJECT_TAGS_RECEIVE_SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          ...action.tags
        },
        isProjectTagsReceiving: false
      };

    case ProjectActions.PROJECT_TAGS_RECEIVE_FAIL:
      return {
        ...state,
        project: {
          ...state.project,
          error: action.error
        },
        isProjectTagsReceiving: false
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
    case ProjectActions.PROJECT_EXTERNAL_USERS_RECEIVE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          externalUsers: action.users || []
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
    case ProjectActions.PROJECT_CHANGE_FAIL_VALIDATION:
      return {
        ...state,
        project: {
          ...state.project,
          validationError: action.error
        }
      };

    case ProjectActions.PROJECT_CHANGE_SUCCESS:
      if (state.project.id !== action.changedFields.id) return state;
      return {
        ...state,
        project: {
          ...state.project,
          ...action.changedFields
        }
      };

    case GitlabActions.ADDING_GITLAB_PROJECT_START:
      return {
        ...state,
        project: {
          ...state.project,
          notProcessedGitlabUsers: []
        }
      };
    case GitlabActions.ADDING_GITLAB_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          gitlabProjectIds: [
            ...(state.project.gitlabProjectIds ? state.project.gitlabProjectIds : []),
            action.project.gitlabProject.id
          ],
          gitlabProjects: [...state.project.gitlabProjects, action.project.gitlabProject],
          users: action.project.projectUsers,
          notProcessedGitlabUsers: action.project.notProcessedGitlabUsers
        }
      };

    case GitlabActions.CREATE_GITLAB_PROJECT_START:
      return {
        ...state,
        project: {
          ...state.project,
          notProcessedGitlabUsers: []
        }
      };
    case GitlabActions.CREATE_GITLAB_PROJECT_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          gitlabProjectIds: [...state.project.gitlabProjectIds, action.project.gitlabProject.id],
          gitlabProjects: [...state.project.gitlabProjects, action.project.gitlabProject],
          users: action.project.projectUsers,
          notProcessedGitlabUsers: action.project.notProcessedGitlabUsers
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

    case ProjectActions.OPEN_CREATE_CHILD_TASK_MODAL:
      return {
        ...state,
        isCreateChildTaskModalOpen: true
      };

    case ProjectActions.OPEN_CREATE_TASK_MODAL:
      return {
        ...state,
        isCreateTaskModalOpen: true
      };

    case ProjectActions.CLOSE_CREATE_TASK_MODAL:
      return {
        ...state,
        isCreateTaskModalOpen: false,
        isCreateChildTaskModalOpen: false
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
          milestones: [],
          history: {
            events: []
          },
          error: false
        },
        TitleIsEditing: false,
        DescriptionIsEditing: false,
        isCreateTaskModalOpen: false
      };

    case ProjectActions.PROJECT_ATTACHMENT_REMOVE_SUCCESS: {
      const { attachmentId } = action;
      const { attachments } = state.project;
      const newAttachments = attachments
        ? attachments.map(attach => ({ ...attach, deleting: attach.id === attachmentId || attach.deleting }))
        : [];

      return {
        ...state,
        project: {
          ...state.project,
          attachments: newAttachments
        }
      };
    }

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
      const attachments = state.project.attachments.map(attachment => {
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
          attachments: [...action.result.data, ...attachments]
        }
      };
    }

    case ProjectActions.PROJECT_ATTACHMENT_UPLOAD_FAIL:
      return {
        ...state,
        project: {
          ...state.project,
          attachments: state.project.attachments.filter(({ id }) => id !== action.attachment.id)
        }
      };

    case ProjectActions.GET_METRICS_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          metrics: action.metrics
        }
      };

    case MilestoneActions.MILESTONE_CREATE_SUCCESS:
      return {
        ...state,
        project: {
          ...state.project,
          milestones: [...state.project.milestones, action.milestone]
        }
      };

    case MilestoneActions.MILESTONE_EDIT_SUCCESS:
      const updatedMilestones = state.project.milestones.map(milestone => {
        return milestone.id === action.milestone.id ? action.milestone : milestone;
      });
      return {
        ...state,
        project: {
          ...state.project,
          milestones: updatedMilestones
        }
      };

    case MilestoneActions.MILESTONE_DELETE_SUCCESS:
      const delelteMilestones = state.project.milestones.filter(milestone => milestone.id !== action.id);
      return {
        ...state,
        project: {
          ...state.project,
          milestones: delelteMilestones
        }
      };

    case JiraActions.JIRA_ASSOCIATE_PROJECT_SUCCESS:
      if (action.project.simtrackProjectId === state.project.id) {
        return {
          ...state,
          project: {
            ...state.project,
            jiraHostname: action.project.jiraHostName,
            jiraProjectName: action.project.jiraProjectName,
            externalId: action.project.id
          }
        };
      }
      return state;

    case JiraActions.CLEAN_JIRA_ASSOCIATION_SUCCESS:
      if (action.id === state.project.id) {
        return {
          ...state,
          project: {
            ...state.project,
            jiraHostname: null,
            jiraProjectName: null,
            externalId: null
          }
        };
      }
      return state;

    case JiraActions.JIRA_STATUS_RECEIVE_INFO:
      if (action.data.length > 0) {
        return {
          ...state,
          project: {
            ...state.project,
            lastSyncDate: action.data[0].date,
            status: action.data[0].status
          }
        };
      }
      return state;

    default:
      return {
        ...state
      };
  }
}
