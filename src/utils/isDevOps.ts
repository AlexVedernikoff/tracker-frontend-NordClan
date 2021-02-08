import { DEV_OPS } from '../constants/Roles';
import { checkIsAdminInProject } from './isAdmin';

/**
 * @deprecated use checkRoles.ts
 */
export const isDevOps = userGlobalRole => userGlobalRole === DEV_OPS;

/**
 * @deprecated use checkRoles.ts
 */
export const isOnlyDevOps = (user, projectId) => {
  return (
    user.globalRole === DEV_OPS &&
    !checkIsAdminInProject(user, projectId) &&
    user.projectsRoles.user.indexOf(projectId) === -1
  );
};
