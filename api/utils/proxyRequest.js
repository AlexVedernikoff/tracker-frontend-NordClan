import request from 'request';

/**
 * Типовая обертка для http(s) запросов (чтобы костыли в одном месте лежали)
 * @param {string} url Относительный урл запроса
 * @param {object} params Дополнительные параметры запроса
 * @param {function} callback Обработчик завершенного запроса
*/
const proxyRequest = (url, params, callback) => {
  return request({
      ...params,
      url: 'http://portaltest.simbirsoft:8080/default/rest/' + url,
      headers: {
        'Authorization': 'Basic c2VydmljZW1hbjpGZEtnJiRiKilGZUF7'
      }
    },
    callback
  );
}

export default proxyRequest;
