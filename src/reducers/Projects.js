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
      }

    case ProjectActions.CLOSE_CREATE_PROJECT_MODAL:
      return {
        ...state,
        isCreateProjectModalOpen: false
      }

    default:
      return state;
  }
}

export default Projects;
