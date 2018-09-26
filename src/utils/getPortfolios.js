import axios from 'axios';
import { API_URL } from '../constants/Settings';

export default function getPortfolios(name = '') {
  return axios
    .get(`${API_URL}/portfolio`, { params: { name } }, { withCredentials: true })
    .then(response => response.data.data)
    .then(portfolios => ({
      options: portfolios.map(portfolio => ({
        label: portfolio.name,
        value: portfolio.id
      }))
    }));
}
