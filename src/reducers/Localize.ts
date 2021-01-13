import { ILocalizeStore } from '~/store/store.type';
import { initMomentLocale } from '../utils/date';

const initialState: ILocalizeStore = {
  lang: initMomentLocale()
};

const Localize = (state = initialState, action): ILocalizeStore => {
  switch (action.type) {
    case 'SET_LOCALIZE':
      return {
        ...state,
        lang: action.lang
      };
    default:
      return state;
  }
};

export default Localize;
