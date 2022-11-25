import env from 'env';

export const WEB_SOCKET_SERVICE_URL = process.env.NODE_ENV === 'development' ? env.WEB_SOCKET_SERVICE : '';
