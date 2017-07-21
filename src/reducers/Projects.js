import * as ProjectActions from '../constants/Projects';

const InitialState = {
  projects: [],
  pageSize: 25,
  currentPage: 1,
  tags: '',
  isCreateProjectModalOpen: false
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
      projects: action.data
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

  default:
    return state;
  }
}

export default Projects;
