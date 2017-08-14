import * as ProjectActions from '../constants/Projects';
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
  case ProjectActions.PROJECTS_RECEIVE_START:
    return {
      ...state
    };

    case ProjectActions.PROJECTS_RECEIVE_SUCCESS:
      return {
        ...state,
        projects: action.data.data,
        pagesCount: action.data.pagesCount
      };

  case ProjectActions.OPEN_CREATE_PROJECT_MODAL:
    return {
      ...state,
      isCreateProjectModalOpen: true
    };

  case ProjectActions.CLOSE_CREATE_PROJECT_MODAL:
    return {
      ...state,
      isCreateProjectModalOpen: false
    };

  case ProjectActions.PROJECT_CREATE_START:
    return {
      ...state
    };

  case ProjectActions.PROJECT_CREATE_SUCCESS:
    return {
      ...state
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

  default:
    return state;
  }
}

export default Projects;
