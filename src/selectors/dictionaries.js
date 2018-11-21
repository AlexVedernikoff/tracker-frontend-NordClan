import { createSelector } from 'reselect';

const getLocalizedDictionary = function(lang, dictionary) {
  return (dictionary || []).map(({ name, nameEn, ...rest }) => ({
    name: lang === 'ru' ? name : nameEn,
    ...rest
  }));
};

const selectMagicActiveTypes = state => state.Dictionaries.magicActivityTypes;
const selectMilestoneTypes = state => state.Dictionaries.milestoneTypes;

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

export const getMilestoneTypes = createSelector([selectMilestoneTypes], types =>
  types.map(type => ({
    id: type.id,
    codename: type.codeName
  }))
);

export const getMagicActiveTypes = createSelector([selectMagicActiveTypes], types =>
  types.map(type => ({
    id: type.id,
    codename: type.codeName,
    isMagicActivity: type.isMagicActivity,
    order: type.order
  }))
);
