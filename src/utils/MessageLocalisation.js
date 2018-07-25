import { store } from '../History';

let lang = 'en';

store.subscribe(() => {
  lang = store.getState().Localize.lang;
});

export function getMessage(history) {
  return lang === 'ru' ? history.message : history.messageEn;
}
