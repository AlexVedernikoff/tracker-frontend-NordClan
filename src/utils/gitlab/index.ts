import localize from './gitlab.json';

export const GITLAB_PROJECT_ACCESS_LEVELS = {
  GUEST: 10, // Guest access
  REPORTER: 20, // Reporter access
  DEVELOPER: 30, // Developer access
  MAINTAINER: 40 // Maintainer access
};

export const GITLAB_ACCESS_LEVELS = {
  ...GITLAB_PROJECT_ACCESS_LEVELS,
  OWNER: 50 // Owner access # Only valid for groups
};

export function getGitlabProjectRoles(lang) {
  return Object.keys(GITLAB_PROJECT_ACCESS_LEVELS).map(key => ({
    value: GITLAB_PROJECT_ACCESS_LEVELS[key],
    label: localize[lang][key]
  }));
}
