import { initMomentLocale } from '../utils/date';

const initialState = {
  lang: initMomentLocale()
};

const Localize = (state = initialState, action) => {
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
