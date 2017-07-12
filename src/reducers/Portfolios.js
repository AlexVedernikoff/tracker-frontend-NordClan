import * as PortfoliosActions from '../constants/Portfolios';

const InitialState = {
  portfolios: []
};

export default function Portfolios(state = InitialState, action) {
  switch (action.type) {
    case PortfoliosActions.GET_PORTFOLIOS_START:
      return {
        ...state
      };

    case PortfoliosActions.GET_PORTFOLIOS_SUCCESS:
      return {
        ...state,
        portfolios: action.portfolios
      }

    default:
      return {
        ...state
      }
  }
}
