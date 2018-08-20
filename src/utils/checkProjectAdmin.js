import { ADMIN } from '../constants/Roles';
import get from 'lodash/get';

const checkProjectAdmin = (user, projectId) => {
  const isSystemAdmin = user.globalRole === ADMIN;
  const isProjectAdmin = get(user, 'projectsRoles.admin', []).includes(projectId);

  return isSystemAdmin || isProjectAdmin;
};

export default checkProjectAdmin;
