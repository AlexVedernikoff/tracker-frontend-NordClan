import { IDictionariesStore } from '~/store/store.type';
import * as dictionariesActions from '../constants/Dictionaries';

const InitialState: IDictionariesStore = {
  taskTypes: [],
  taskStatuses: [],
  magicActivityTypes: [],
  departments: [],
  timeSheetsStatus: []
};

export default function Portfolios(state = InitialState, action): IDictionariesStore {
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
