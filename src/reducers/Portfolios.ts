import { IPortfoliosStore } from '~/store/store.type';
import * as PortfoliosActions from '../constants/Portfolios';

const InitialState: IPortfoliosStore = {
  portfolios: []
};


export default function Portfolios (state = InitialState, action): IPortfoliosStore {
  switch (action.type) {
  case PortfoliosActions.GET_PORTFOLIOS_START:
    return {
      ...state
    };

  case PortfoliosActions.GET_PORTFOLIOS_SUCCESS:
    return {
      ...state,
      portfolios: action.portfolios
    };

  default:
    return {
      ...state
    };
  }
}
