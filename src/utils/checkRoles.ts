import { Roles } from '../constants/Roles';

const isAdmin = userGlobalRole => userGlobalRole === Roles.ADMIN;

const checkIsAdminInProject = (user, projectId) => {
  return isAdmin(user.globalRole) || (user.projectsRoles && user.projectsRoles.admin.indexOf(projectId) !== -1);
};

const isDevOps = userGlobalRole => userGlobalRole === Roles.DEV_OPS;

const isOnlyDevOps = (user, projectId) => {
  return (
    user.globalRole === Roles.DEV_OPS &&
    !checkIsAdminInProject(user, projectId) &&
    user.projectsRoles.user.indexOf(projectId) === -1
  );
};

const isExternalUser = userGlobalRole => userGlobalRole ===  Roles.EXTERNAL_USER;

const isHR = userGlobalRole => userGlobalRole === Roles.HR;

const isVisor = userGlobalrole => userGlobalrole === Roles.VISOR;

const isUser = userGlobalrole => userGlobalrole === Roles.USERS;

export default {
  isAdmin,
  checkIsAdminInProject,
  isDevOps,
  isOnlyDevOps,
  isExternalUser,
  isHR,
  isVisor,
  isUser,
}