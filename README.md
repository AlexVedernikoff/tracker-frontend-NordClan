# [Epic]

---

### Процесс написания кода

##### МР считается сразу же не пройденным, если данные условия не были выполнены:

- Новые файлы создавать с расширением `.tsx` или `.ts`, их можно импортировать из `.js` файлов как обычно
- Новые компоненты писать на реакт хуках

### Процесс создания МР

##### МР считается сразу же не пройденным, если данные условия не были выполнены:

- Название ветки начинается с типа задачи (**feat** или **bug**) и номера задачи через слэш, например: feat/TR-123 ` или bug/TR-123
- МР делается на ветку **develop**, после успешного прохождения тестирования на ветке **develop**, создается МР на ветку **staging**
- Каждый МР должен **содержать ссылку на задачу** в описании
- Каждый МР должен содержать только **ОДИН** коммит, касающийся задачи. Исправления по ревью должны объединятся с этим коммитом

### Установка

Используйте докер-контейнер в `track-back`.
