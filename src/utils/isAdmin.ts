import { ADMIN } from '../constants/Roles';

/**
 * @deprecated use checkRoles.ts
 */
export const isAdmin = userGlobalRole => userGlobalRole === ADMIN;

/**
 * @deprecated use checkRoles.ts
 */
export const checkIsAdminInProject = (user, projectId) => {
  return isAdmin(user.globalRole) || (user.projectsRoles && user.projectsRoles.admin.indexOf(projectId) !== -1);
};

export default isAdmin;
