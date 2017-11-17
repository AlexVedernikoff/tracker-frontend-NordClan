import * as ProjectsActions from '../constants/Projects';
import * as ProjectActions from '../constants/Project';
import * as TagsActions from '../constants/Tags';

const InitialState = {
  projects: [],
  pageSize: 20,
  currentPage: 1,
  pagesCount: 1,
  tags: '',
  isCreateProjectModalOpen: false,
  tagsFilter: []
};

function Projects (state = InitialState, action) {
  switch (action.type) {
  case ProjectsActions.PROJECTS_RECEIVE_START:
    return {
      ...state
    };

    case ProjectsActions.PROJECTS_RECEIVE_SUCCESS:
      return {
        ...state,
        projects: action.data.data,
        pagesCount: action.data.pagesCount
      };

  case ProjectsActions.OPEN_CREATE_PROJECT_MODAL:
    return {
      ...state,
      isCreateProjectModalOpen: true
    };

  case ProjectsActions.CLOSE_CREATE_PROJECT_MODAL:
    return {
      ...state,
      isCreateProjectModalOpen: false
    };

  case ProjectsActions.PROJECT_CREATE_START:
    return {
      ...state
    };

  case ProjectsActions.PROJECT_CREATE_SUCCESS:
    return {
      ...state,
      projects: [action.createdProject, ...state.projects]
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
        }
      } else {
        return project;
      }
    })
    return {
      ...state,
      projects: updatedProjects
    };

  default:
    return state;
  }
}

export default Projects;
