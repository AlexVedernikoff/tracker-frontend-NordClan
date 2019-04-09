import get from 'lodash/get';
import localize from './attachments.json';

const isFileNameLengthError = error => {
  const status = get(error, 'response.status');

  if (status !== 400) {
    return false;
  }

  const errors = get(error.response.data, 'message.errors', []);
  return errors.some(({ param }) => param === 'path' || param === 'fileName');
};

export const getUploadAttachmentsErrorMessage = (error, lang) => {
  return isFileNameLengthError(error) ? localize[lang].MAX_FILE_LENGTH_ERROR : localize[lang].FILE_UPLOAD_ERROR;
};
