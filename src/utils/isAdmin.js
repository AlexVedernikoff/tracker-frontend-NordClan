import { ADMIN } from '../constants/Roles';

export const isAdmin = userGlobalRole => userGlobalRole === ADMIN;

export const checkIsAdminInProject = (user, projectId) => {
  return isAdmin(user.globalRole) || (user.projectsRoles && user.projectsRoles.admin.indexOf(projectId) !== -1);
};

export default isAdmin;
