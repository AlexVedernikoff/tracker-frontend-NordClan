import * as ProjectActions from '../constants/Projects';

const InitialState = {
  projects: [],
  pageSize: 25,
  currentPage: 1,
  tags: ''
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

    default:
      return state;
  }
}

export default Projects;
