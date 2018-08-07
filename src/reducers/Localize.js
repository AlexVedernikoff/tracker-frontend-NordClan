const initialState = {
  lang: localStorage.getItem('lang') || 'en'
};

const Localize = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOCALIZE':
      localStorage.setItem('lang', action.lang);

      return {
        ...state,
        lang: action.lang
      };
    default:
      return state;
  }
};

export default Localize;
