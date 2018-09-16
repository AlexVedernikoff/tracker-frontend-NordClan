/**
 Сервис обработки меншенов
 */
export const ALL = 'all';
const expectedMentionReg = /({@all}|{@[0-9]+})/;
const expectedMentionSeparatorsReg = /[{@}]/g;
const userMentionReg = /^@[^@]+$/;
const lastMentionReg = /@([^@\s]+\s?[^@\s]+|[^@\s]+)$/;
export const splitCommentByMentions = text =>
  typeof text === 'string' ? text.split(expectedMentionReg).filter(x => x) : [];

export const replaceWithMentions = (array, suggestions, replace) => {
  return array.map((x, i) => {
    if (!expectedMentionReg.test(x)) return x;
    const id = x.replace(expectedMentionSeparatorsReg, '');
    const mention = suggestions.find(s => s.id === (id !== ALL ? +id : ALL));
    return mention ? replace(mention, i) : x;
  });
};

export const replaceLabelWithAt = m => `@${m.label}`;
export const replaceValueWithIdPattern = m => `{@${m.value}}`;

export const parseCommentForDisplay = (text, suggestions, replace) =>
  replaceWithMentions(splitCommentByMentions(text), suggestions, replace);

export const prepairCommentForEdit = (text, suggestions, replace = replaceLabelWithAt) =>
  replaceWithMentions(splitCommentByMentions(text), suggestions, replace).join('');

export const splitUserCommentByMentionLabels = (text, suggests, replace = replaceLabelWithAt) => {
  const dinamicRegexp = new RegExp(`(${suggests.map(replace).join('|')})`);
  return text.split(dinamicRegexp).filter(x => x);
};

export const replaceUserMentionsWithMentionsId = (array, suggests) => {
  return array.map(x => {
    if (!userMentionReg.test(x)) return x;
    const label = x.slice(1);
    const suggest = suggests.find(s => s.label === label);
    return suggest ? replaceValueWithIdPattern(suggest) : x;
  });
};

export const stringifyCommentForSend = (text, suggests) => {
  return replaceUserMentionsWithMentionsId(splitUserCommentByMentionLabels(text, suggests), suggests).join('');
};

export const findLastPosibleMention = (text, len) => {
  const result = lastMentionReg.exec(text.slice(0, len));
  return result ? result[1] : false;
};

export const findActiveMention = (text, len, suggests) => {
  const result = findLastPosibleMention(text, len);
  if (!result) return [];
  return suggests.filter(s => s.label.indexOf(result) === 0);
};
export const replaceActiveMention = (text, len, suggest) => {
  const result = findLastPosibleMention(text, len);
  if (!result) return [text, len];
  return [
    `${text.slice(0, len - result.length)}${suggest.label} ${text.slice(len)}`,
    len - result.length + suggest.label.length + 1
  ];
};
