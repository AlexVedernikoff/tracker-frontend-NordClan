import * as ProjectActions from '../constants/Projects';

const InitialState = {
  projects: [],
  pageSize: 25,
  currentPage: 1,
  tags: '',
  isReceiving: false
};

function Projects (state = InitialState, action) {
  switch (action.type) {
    case ProjectActions.PROJECTS_RECEIVE_START:
      return {
        ...state,
        isReceiving: true
      };

    case ProjectActions.PROJECTS_RECEIVE_ERROR:
      return {
        ...state,
        isReceiving: false
      };

    case ProjectActions.PROJECTS_RECEIVE_SUCCESS:
      return {
        ...state,
        projects: action.data,
        isReceiving: false
      };

    default:
      return state;
  }
}

export default Projects;
