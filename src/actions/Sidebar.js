import * as ACTIONS from '../constants/Sidebar';

export const setSidebarState = config => ({
  type: ACTIONS.SET_SIDEBAR_STATE,
  config
});
