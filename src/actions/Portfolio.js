import * as PortfolioActions from '../constants/Portfolio';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';

const startPortfolioReceive = () => ({
  type: PortfolioActions.PORTFOLIO_RECEIVE_START
});

const portfolioReceived = portfolio => ({
  type: PortfolioActions.PORTFOLIO_RECEIVE_SUCCESS,
  data: portfolio
});

const getPortfolio = (portfolioId) => {
  const URL = '/api/project';
  return dispatch => {
    dispatch(startPortfolioReceive());
    dispatch(startLoading());
    axios
      .get(URL, {params: {portfolioId}}, { withCredentials: true })
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(portfolioReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};

export default getPortfolio;
