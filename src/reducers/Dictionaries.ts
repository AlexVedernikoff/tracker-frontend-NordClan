import * as dictionariesActions from '../constants/Dictionaries';

const InitialState = {
  taskTypes: [],
  taskStatuses: [],
  magicActivityTypes: [],
  departments: []
};

export default function Portfolios(state = InitialState, action) {
  switch (action.type) {
    case dictionariesActions.GET_DICTIONARY_START:
      return {
        ...state
      };

    case dictionariesActions.GET_DICTIONARY_SUCCESS:
      return {
        ...state,
        [action.name]: action.data
      };

    case dictionariesActions.GET_DEPARTMENTS:
      return {
        ...state,
        [action.name]: action.data
      };

    default:
      return {
        ...state
      };
  }
}