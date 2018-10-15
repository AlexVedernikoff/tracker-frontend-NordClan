/**
 * Тестирование сервиса
 **/
import {
  ALL,
  splitCommentByMentions,
  parseCommentForDisplay,
  replaceWithMentions,
  prepairCommentForEdit,
  splitUserCommentByMentionLabels,
  replaceUserMentionsWithMentionsId,
  stringifyCommentForSend,
  findLastPosibleMention,
  findActiveMention,
  replaceActiveMention
} from './mentionService';

describe('Меншены', () => {
  /*** ПОКАЗ */
  test('Разбиение не строки', () => {
    const noStr = {};
    expect(splitCommentByMentions(noStr)).toEqual([]);
  });
  test('Разбиение строки без меншенов', () => {
    const str = 'Я строка';
    expect(splitCommentByMentions(str)).toEqual([str]);
  });
  test('Разбиение строки c 1 числовым меншеном', () => {
    const str = 'Я строка {@1}';
    expect(splitCommentByMentions(str)).toEqual(['Я строка ', '{@1}']);
  });
  test('Разбиение строки c all меншеном', () => {
    const str = 'Я строка   {@all}';
    expect(splitCommentByMentions(str)).toEqual(['Я строка   ', '{@all}']);
  });
  test('Разбиение строки c со смесью меншенов', () => {
    const str = '{@99}Я строка {@all} 123@12{@123}@11';
    expect(splitCommentByMentions(str)).toEqual(['{@99}', 'Я строка ', '{@all}', ' 123@12', '{@123}', '@11']);
  });
  test('Замена id и all из массива suggests', () => {
    const suggests = [{ id: ALL, label: 'Всем' }, { id: 99, label: 'User1' }, { id: 123, label: 'User2' }];
    const replace = suggest => suggest.label;
    expect(
      replaceWithMentions(['{@99}', 'Я строка ', '{@all}', ' 123@12', '{@123}', '@11'], suggests, replace)
    ).toEqual([suggests[1].label, 'Я строка ', suggests[0].label, ' 123@12', suggests[2].label, '@11']);
  });
  test('Потерянный меншен не заменяется', () => {
    const suggests = [{ id: ALL, label: 'Всем' }, { id: 99, label: 'User1' }];
    const replace = suggest => suggest.label;
    expect(
      replaceWithMentions(['{@99}', 'Я строка ', '{@all}', ' 123@12', '{@123}', '@11'], suggests, replace)
    ).toEqual([suggests[1].label, 'Я строка ', suggests[0].label, ' 123@12', '{@123}', '@11']);
  });
  test('Полный парсинг строки', () => {
    const str = '{@99}Я строка {@all} 123@12{@123}@11';
    const suggests = [{ id: ALL, label: 'Всем' }, { id: 99, label: 'User1' }, { id: 123, label: 'User2' }];
    const replace = suggest => suggest.label;
    expect(parseCommentForDisplay(str, suggests, replace)).toEqual([
      suggests[1].label,
      'Я строка ',
      suggests[0].label,
      ' 123@12',
      suggests[2].label,
      '@11'
    ]);
  });
  /** РЕДАКТИРОВАНИЕ */
  test('Полная подготовка строки для редактирования', () => {
    const suggests = [
      { id: ALL, fullNameRu: 'Всем' },
      { id: 99, fullNameRu: 'User1' },
      { id: 123, fullNameRu: 'User2' }
    ];
    const result = `@${suggests[1].fullNameRu}Я строка @${suggests[0].fullNameRu} 123@12@${suggests[2].fullNameRu}@11`;
    const input = `{@${suggests[1].id}}Я строка {@${suggests[0].id}} 123@12{@${suggests[2].id}}@11`;
    expect(prepairCommentForEdit(input, suggests)).toEqual(result);
  });
  test('Разбиение редактируемой строки по меншенам', () => {
    const suggests = [
      { id: ALL, fullNameRu: 'Всем' },
      { id: 99, fullNameRu: 'User1' },
      { id: 123, fullNameRu: 'User2' }
    ];
    const input = `@${suggests[1].fullNameRu}Я строка @${suggests[0].fullNameRu} 123@12@${suggests[2].fullNameRu}@11`;
    expect(splitUserCommentByMentionLabels(input, suggests)).toEqual([
      `@${suggests[1].fullNameRu}`,
      'Я строка ',
      `@${suggests[0].fullNameRu}`,
      ' 123@12',
      `@${suggests[2].fullNameRu}`,
      '@11'
    ]);
  });
  test('Замена labels меншенов редактируемой строки на их id-паттерны {@123}', () => {
    const suggests = [
      { id: ALL, fullNameRu: 'Всем' },
      { id: 99, fullNameRu: 'User1' },
      { id: 123, fullNameRu: 'User2' }
    ];
    expect(
      replaceUserMentionsWithMentionsId(
        [
          `@${suggests[1].fullNameRu}`,
          'Я строка ',
          `@${suggests[0].fullNameRu}`,
          ' 123@12',
          `@${suggests[2].fullNameRu}`,
          '@11'
        ],
        suggests
      )
    ).toEqual([`{@${suggests[1].id}}`, 'Я строка ', `{@${suggests[0].id}}`, ' 123@12', `{@${suggests[2].id}}`, '@11']);
  });
  test('Полная склейка редактируемой строки', () => {
    const suggests = [
      { id: ALL, fullNameRu: 'Всем' },
      { id: 99, fullNameRu: 'User1' },
      { id: 123, fullNameRu: 'User2' }
    ];
    const input = `@${suggests[1].fullNameRu}Я строка @${suggests[0].fullNameRu} 123@12@${suggests[2].fullNameRu}@11`;
    const result = `{@${suggests[1].id}}Я строка {@${suggests[0].id}} 123@12{@${suggests[2].id}}@11`;

    expect(stringifyCommentForSend(input, suggests)).toEqual(result);
  });
  /*** ДЛЯ ТОГЛА СПИСКА*/
  test('Последний меншен под курсором', () => {
    const suggests = [{ value: ALL, label: 'Всем' }, { value: 99, label: 'User1 h1' }, { value: 123, label: 'User2' }];
    const input = `@${suggests[1].label}Я строка @${suggests[0].label} 123@12@${suggests[2].label}@11`;

    expect(findLastPosibleMention(input, 9)).toEqual(suggests[1].label);
    expect(findLastPosibleMention(input, input.length)).toEqual('11');
    expect(findLastPosibleMention(input, 18)).toEqual(false);
  });
  test('Саджесты последнего меншена', () => {
    const suggests = [{ value: ALL, label: 'Всем' }, { value: 99, label: 'User1 h1' }, { value: 123, label: 'User2' }];
    const input = `@${suggests[1].label}Я строка @${suggests[0].label} 123@12@${suggests[2].label}@11`;

    expect(findActiveMention(input, 9, suggests)).toEqual([suggests[1]]);
    expect(findActiveMention(input, input.length, suggests)).toEqual([]);
    expect(findActiveMention(input, 18, suggests)).toEqual([]);
  });
  test('Замена меншен под курсором', () => {
    const suggests = [{ value: ALL, label: 'Всем' }, { value: 99, label: 'User1 h1' }, { value: 123, label: 'User2' }];
    const input = `@${suggests[1].label}Я строка @${suggests[0].label} 123@12@${suggests[2].label}@11`;
    const result1 = `@${suggests[1].label} Я строка @${suggests[0].label} 123@12@${suggests[2].label}@11`;
    const result2 = `@${suggests[1].label}Я строка @${suggests[0].label} 123@12@${suggests[2].label}@${
      suggests[1].label
    } `;

    expect(replaceActiveMention(input, 9, suggests[1])).toEqual([result1, 9 + 1]);
    expect(replaceActiveMention(input, input.length, suggests[1])).toEqual([
      result2,
      input.length - 2 + suggests[1].label.length + 1
    ]);
    expect(replaceActiveMention(input, 18)).toEqual([input, 18]);
  });
});
