export const EN_SYMBOLS_REGEX = /[a-zA-Z\\0-9\\!#$%+\(\)\*\.~_=`]/g;

export const RU_SYMBOLS_REGEX = /[А-яЁё\\0-9\\!#$%+\(\)\*\.~_=`]/g;

export const TELEGRAM_SYMBOLS_REGEX = /^(?=.*[a-zA-Z])+(?=.*[0-9])*(?=.*_)*[A-z0-9_]{5,}$/;
