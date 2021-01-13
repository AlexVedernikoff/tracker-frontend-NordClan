import * as ProjectsActions from '../constants/Projects';
import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';
import { IProjectsStore } from '~/store/store.type';

const InitialState: IProjectsStore = {
  projects: [] as any[],
  pageSize: 20,
  currentPage: 1,
  pagesCount: 1,
  tags: '',
  allTags: [] as any[],
  isCreateProjectModalOpen: false,
  tagsFilter: [] as any[],
  error: null
};

function Projects(state = InitialState, action): IProjectsStore {
  switch (action.type) {
    case ProjectsActions.PROJECTS_RECEIVE_START:
      return {
        ...state,
        isProjectsReceived: false
      };
    case ProjectsActions.PROJECTS_RECEIVE_SUCCESS:
      return {
        ...state,
        projects: action.data.data,
        allTags: action.data.allTags,
        pagesCount: action.data.pagesCount,
        isProjectsReceived: true
      };

    case ProjectsActions.OPEN_CREATE_PROJECT_MODAL:
      return {
        ...state,
        isCreateProjectModalOpen: true
      };

    case ProjectsActions.CLOSE_CREATE_PROJECT_MODAL:
      return {
        ...state,
        error: null,
        isCreateProjectModalOpen: false
      };

    case ProjectsActions.PROJECT_CREATE_START:
      return {
        ...state,
        error: null
      };

    case ProjectsActions.PROJECT_CREATE_SUCCESS:
      return {
        ...state,
        projects: [action.createdProject, ...state.projects]
      };

    case ProjectsActions.PROJECT_CREATE_FAIL:
      return {
        ...state,
        error: action.error
      };

    case TagsActions.GET_TAGS_FILTER_SUCCESS:
      if (action.data.filterFor === 'project') {
        return {
          ...state,
          tagsFilter: action.data.filteredTags
        };
      }
      return {
        ...state
      };

    case ProjectActions.PROJECT_CHANGE_SUCCESS:
      const updatedProjects = state.projects.map(project => {
        if (project.id === action.changedFields.id) {
          return {
            ...project,
            ...action.changedFields
          };
        } else {
          return project;
        }
      });
      return {
        ...state,
        projects: updatedProjects
      };

    default:
      return state;
  }
}

export default Projects;
