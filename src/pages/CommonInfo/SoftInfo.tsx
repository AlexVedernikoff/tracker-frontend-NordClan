import React, { FC } from 'react';
import * as info from './styles.scss';

export const SoftInfo: FC = () => {
  return (
    <article className={info.article}>
      <h1>Список софта для начала работы</h1>

      <p>Список софта для работы в компании Норд Клан</p>

      <h2>Менеджмент: </h2>

      <ul>
        <li>
          Messengers: Telegram, Skype, Zoom
        </li>

        <li>
          Google suite
        </li>

        <li>
          MP3 Skype Recorder
        </li>
      </ul>

      <h2>Frontend:</h2>

      <ul>
        <li>
          OS: Windows vs Ubuntu
        </li>

        <li>
          IDE: Web Storm (или аналоги VS Code)
        </li>

        <li>
          Messengers: Skype, Telegram, Zoom
        </li>

        <li>
          Тестовый редактор: sublime/notepad++
        </li>

        <li>
          Системы контроля версий: git
        </li>

        <li>
          Браузеры: chrome, firefox, Edge
        </li>

        <li>
          Программа записи скринкастов (e.g. Monosnap)
        </li>

        <li>
          Программа для работы с текстовыми документами аналог Office
        </li>

        <li>
          Контейнеры: docker
        </li>

        <li>
          Пакетные менеджеры: npm и yarn
        </li>

        <li>
          REST: Postman
        </li>

        <li>
          Архиватор: winrar/winzip или подобное
        </li>
      </ul>

      <h2>Java Backend:</h2>

      <ul>
        <li>
          OS: Windows vs Ubuntu
        </li>

        <li>
          IDE: intellij idea (или аналоги VS Code)
        </li>

        <li>
          Язык: Java 8 и Java 14
        </li>

        <li>
          REST: Postman
        </li>

        <li>
          Messengers: Telegram, Skype, Zoom
        </li>

        <li>
          Системы контроля версий: git
        </li>

        <li>
          Сборщики: maven, gradle
        </li>

        <li>
          Текстовый редактор: Notpad++ или atom или VSC
        </li>

        <li>
          Контейнеры: Docker
        </li>
      </ul>

      <h2>.net Backend:</h2>

      <ul>
        <li>
          OS: Windows vs Ubuntu
        </li>

        <li>
          IDE: Visual Studio, Visual Studio Code или Jetbrains Rider
        </li>

        <li>
          IDE по БД(на усмотрение): MsSQL Managment Studio, MongoDB Compass
        </li>

        <li>
          SDK: .net core 3.1 и .net 5
        </li>

        <li>
          REST: Postman
        </li>

        <li>
          Messengers: Telegram, Skype, Zoom
        </li>

        <li>
          Системы контроля версий: git;
        </li>

        <li>
          Клиент git(по желанию): Github Desktop или Source Tree
        </li>

        <li>
          Текстовый редактор: Notpad++ или atom или VSC
        </li>

        <li>
          Контейнеры: Docker
        </li>
      </ul>

      <h2>QA:</h2>

      <ul>
        <li>
          Messengers: Skype, Telegram, Zoom
        </li>

        <li>
          Браузеры: chrome, firefox
        </li>

        <li>
          Архиватор: winrar/winzip или подобное
        </li>

        <li>
          Программа записи скринкастов (e.g. Monosnap)
        </li>

        <li>
          Скриншотер (e.g. Lightshot или тот же Monosnap)
        </li>

        <li>
          Программа для работы с текстовыми документами: Libreoffice
        </li>

        <li>
          Программы для тестирования API: Postman, Soap UI
        </li>
      </ul>

      <h2>Могут понадобится:</h2>

      <ul>
        <li>
          Система контроля версий: git
        </li>

        <li>
          IDE: IntelliJ IDEA (community version)
        </li>

        <li>
          Сборщик: maven
        </li>

        <li>
          Язык: Java 8
        </li>
      </ul>
    </article>
  );
};
