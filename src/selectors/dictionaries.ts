import { createSelector } from 'reselect';
import { getFullName } from '../utils/NameLocalisation';

//todo: ST-12988: убрать дублирование локализаций, либо убрать локализацию с клиента
const MagicActiveTypesDictionary = {
  en: {
    IMPLEMENTATION: 'Implementation',
    MEETING: 'Meeting',
    PRESALE: 'Presale and estimation',
    EDUCATION: 'Education',
    VACATION: 'Vacation',
    BUSINESS_TRIP: 'Business trip',
    CONTROL: 'Managment',
    HOSPITAL: 'On sick leave'
  },
  ru: {
    IMPLEMENTATION: 'Работа',
    MEETING: 'Совещание',
    PRESALE: 'Преселлинг и оценка',
    EDUCATION: 'Обучение',
    VACATION: 'Отпуск',
    BUSINESS_TRIP: 'Командировка',
    CONTROL: 'Управление',
    HOSPITAL: 'Больничный'
  }
};

const getLocalizedDictionary = function(lang, dictionary) {
  return (dictionary || []).map(({ name, nameEn, ...rest }) => ({
    name: lang === 'ru' ? name : nameEn,
    ...rest
  }));
};

const selectMagicActiveTypes = state => state.Dictionaries.magicActivityTypes;
const selectMilestoneTypes = state => state.Dictionaries.milestoneTypes;
const selectProjectTypes = state => state.Dictionaries.projectTypes;

export const getLocalizedTaskTypes = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.taskTypes,
  getLocalizedDictionary
);

export const getLocalizedUsers = createSelector(
  (state: any) => state.Project.project.users,
  (state: any) => state.Localize.lang,
  users => {
    const localizedUsers = users.map(user => {
      return { ...user, name: getFullName(user) };
    });
    return localizedUsers;
  }
);

export const getLocalizedTaskStatuses = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.taskStatuses,
  getLocalizedDictionary
);

export const getLocalizedRoles = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.roles,
  getLocalizedDictionary
);

export const getLocalizedMagicActiveTypes = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.magicActivityTypes,
  (lang, dictionary) => {
    return (dictionary || []).map(props => ({
      name: MagicActiveTypesDictionary[lang][props.codename],
      ...props
    }));
  }
);

export const getLocalizedTestCaseStatuses = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.testCaseStatuses,
  getLocalizedDictionary
);

export const getLocalizedTestCaseSeverities = createSelector(
  (state: any) => state.Localize.lang,
  (state: any) => state.Dictionaries.testCaseSeverities,
  getLocalizedDictionary
);

export const getProjectTypes = createSelector([selectProjectTypes], types =>
  (types || []).map(type => ({
    id: type.id,
    codename: type.codeName
  }))
);

export const getMilestoneTypes = createSelector([selectMilestoneTypes], types =>
  (types || []).map(type => ({
    id: type.id,
    codename: type.codeName
  }))
);

export const getMagicActiveTypes = createSelector([selectMagicActiveTypes], types =>
  (types || []).map(type => ({
    id: type.id,
    codename: type.codeName,
    isMagicActivity: type.isMagicActivity,
    order: type.order
  }))
);
