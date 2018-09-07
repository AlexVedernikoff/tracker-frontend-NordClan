import { createSelector } from 'reselect';

export const getLocalizedTaskTypes = createSelector(
  state => state.Localize.lang,
  state => state.Dictionaries.taskTypes,
  (lang, taskTypes) =>
    taskTypes.map(({ name, nameEn, ...rest }) => ({
      name: lang === 'ru' ? name : nameEn,
      ...rest
    }))
);
