const initialState = {
  lang: 'en'
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
