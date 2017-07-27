import * as portfolioActions from '../constants/Portfolio';

const InitialState = {
  data: [],
  name: ''
};

function portfolio (state = InitialState, action) {
  switch (action.type) {
  case portfolioActions.PORTFOLIO_RECEIVE_START:
    return {
      ...state
    };

  case portfolioActions.PORTFOLIO_RECEIVE_SUCCESS:
    return {
      ...state,
      data: action.data.data
    };

  case portfolioActions.PORTFOLIO_NAME_RECEIVE_START:
    return {
      ...state
    };

  case portfolioActions.PORTFOLIO_NAME_RECEIVE_SUCCESS:
    console.log(action.data);
    return {
      ...state,
      name: action.data.name
    };

  default:
    return state;
  }
}

export default portfolio;
