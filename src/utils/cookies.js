import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const setCookies = (key, value) => {
  cookies.set(key, value, { path: '/' });
};
