import { createSelector } from 'reselect';

const getLocalizedDictionary = function(lang, dictionary) {
  return (dictionary || []).map(({ name, nameEn, ...rest }) => ({
    name: lang === 'ru' ? name : nameEn,
    ...rest
  }));
};

export const getLocalizedTaskTypes = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.taskTypes,
  getLocalizedDictionary
);

export const getLocalizedTaskStatuses = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.taskStatuses,
  getLocalizedDictionary
);

export const getLocalizedMagicActiveTypes = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.magicActivityTypes,
  getLocalizedDictionary
);

export const getLocalizedMilestoneTypes = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.milestoneTypes,
  getLocalizedDictionary
);

export const getLocalizedProjectTypes = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.projectTypes,
  getLocalizedDictionary
);

export const getLocalizedRoles = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.roles,
  getLocalizedDictionary
);
