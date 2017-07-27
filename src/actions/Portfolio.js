import * as PortfolioActions from '../constants/Portfolio';
import axios from 'axios';
import { startLoading, finishLoading } from './Loading';
import { showNotification } from './Notifications';
import { API_URL } from '../constants/Settings';

const startPortfolioReceive = () => ({
  type: PortfolioActions.PORTFOLIO_RECEIVE_START
});

const startPortfolioNameReceive = () => ({
  type: PortfolioActions.PORTFOLIO_NAME_RECEIVE_START
});

const portfolioNameReceived = (portfolioName) => ({
  type: PortfolioActions.PORTFOLIO_NAME_RECEIVE_SUCCESS,
  data: portfolioName
});

const portfolioReceived = portfolio => ({
  type: PortfolioActions.PORTFOLIO_RECEIVE_SUCCESS,
  data: portfolio
});

export const getPortfolio = (portfolioId) => {
  const URL = `${API_URL}/project`;
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

export const getPortfolioName = (portfolioId) => {
  const URL = `${API_URL}/portfolio/${portfolioId}`;
  return dispatch => {
    dispatch(startPortfolioNameReceive());
    dispatch(startLoading());
    axios
      .get(URL)
      .catch(error => {
        dispatch(finishLoading());
        dispatch(showNotification({ message: error.message, type: 'error' }));
      })
      .then(response => {
        if (response && response.status === 200) {
          dispatch(portfolioNameReceived(response.data));
          dispatch(finishLoading());
        }
      });
  };
};
