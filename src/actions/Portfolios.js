import * as PortfoliosActions from '../constants/Portfolios';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';
import { ShowNotification } from './Notifications';

const startPortfoliosRequest = () => ({
  type: PortfoliosActions.GET_PORTFOLIOS_START
});

const successPortfoliosRequest = portfolios => ({
  type: PortfoliosActions.GET_PORTFOLIOS_SUCCESS,
  portfolios: portfolios
});

const getPortfolios = () => {
  const URL = 'api/portfolio';

  return dispatch => {
    dispatch(startPortfoliosRequest());
    dispatch(StartLoading());

    axios
      .get(URL, { withCredentials: true })
      .catch(error => {
        dispatch(FinishLoading());
        dispatch(ShowNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successPortfoliosRequest(response.data.data));
          dispatch(FinishLoading());
        }
      });
  };
};

export { getPortfolios };
