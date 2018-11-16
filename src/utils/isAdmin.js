import { ADMIN } from '../constants/Roles';

export const isAdmin = userGlobalRole => userGlobalRole === 'ADMIN';

export const checkIsAdminInProject = (user, projectId) => {
  return user.projectsRoles ? user.projectsRoles.admin.indexOf(projectId) !== -1 || user.globalRole === ADMIN : false;
};

export default isAdmin;
