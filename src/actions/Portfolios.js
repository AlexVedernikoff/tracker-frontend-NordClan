import * as PortfoliosActions from '../constants/Portfolios';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

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
    dispatch(startLoading());

    axios
      .get(URL, { withCredentials: true })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(successPortfoliosRequest(response.data.data));
          dispatch(finishLoading());
        }
      });
  };
};

export { getPortfolios };
