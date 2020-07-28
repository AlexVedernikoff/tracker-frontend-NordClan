# [Epic]

---

### Установка

Порядок действия для установки необходимых компонентов для запуска проекта

#### Сборка на Windows без Docker

Заменить в файле `package.json` эти строки:

```js
"prebuild": "rm -rf build/",
"preinstall": "rm -rf node_modules/",
```

на

```js
"prebuild": "echo rm -rf build/",
"preinstall": "echo rm -rf node_modules/",
```

#### 1. Клонируем репозиторий

    git clone git@gitlab.nordclan:track/track-front.git

#### 2. Устанавливаем необходимые _node modules_

    npm install

#### 3. Запускаем локальный сервер с Hot Module Replacement

На данный момент эта информация не актуальна, используйте докер контейнер в `track-back`.

    npm run start

---

– frontend-team
