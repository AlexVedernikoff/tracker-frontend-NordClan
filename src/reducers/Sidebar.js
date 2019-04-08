import * as ACTIONS from '../constants/Sidebar';

const initialState = {
  isOpen: true,
  isDocked: false
};

const Sidebar = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SIDEBAR_STATE:
      return {
        ...state,
        ...action.config
      };
    default:
      return state;
  }
};

export default Sidebar;
