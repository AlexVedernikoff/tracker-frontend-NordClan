import request from 'request-promise';

/**
 * Типовая обертка для http(s) запросов (чтобы костыли в одном месте лежали)
 * @see https://www.npmjs.com/package/request-promise
 * @param {string} url Относительный урл запроса
 * @param {object} params Дополнительные параметры запроса
 * @returns {Promise}
*/
export default function proxyRequest (url, params) {
  return request({
      ...params,
      uri: 'http://portaltest.simbirsoft:8080/default/rest/' + url,
      headers: {
        'Authorization': 'Basic c2VydmljZW1hbjpGZEtnJiRiKilGZUF7'
      },
      json: true
    });
};
