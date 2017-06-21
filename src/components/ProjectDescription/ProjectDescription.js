import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectDescription.scss';

class ProjectDescription extends Component {
  render() {
    return (
      <div className={css.projectDesc}>
        <h2>Описание</h2>
        <div className="wiki">
          <p dir="auto">URL DEV стенда:</p>

          <ul dir="auto">
            <li>
              административный интерфейс{' '}
              <a
                href="http://admin.dev.qiwi-artek.simbirsoft/"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://admin.dev.qiwi-artek.simbirsoft/
              </a>
            </li>
            <li>
              пользовательский интерфейс{' '}
              <a
                href="http://dev.qiwi-artek.simbirsoft/"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://dev.qiwi-artek.simbirsoft/
              </a>
            </li>
            <li>
              бекенд API{' '}
              <a
                href="http://dev.qiwi-artek.simbirsoft:45101"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://dev.qiwi-artek.simbirsoft:45101
              </a>
            </li>
            <li>
              swagger:{' '}
              <a
                href="http://dev.qiwi-artek.simbirsoft:45101/swagger"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://dev.qiwi-artek.simbirsoft:45101/swagger
              </a>
            </li>
            <li>PostgreSQL dev.qiwi-artek.simbirsoft:45102 (artek:Uthu9pha)</li>
          </ul>

          <p dir="auto">URL TEST стенда:</p>

          <ul dir="auto">
            <li>
              административный интерфейс{' '}
              <a
                href="http://admin.test.qiwi-artek.simbirsoft/"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://admin.test.qiwi-artek.simbirsoft/
              </a>
            </li>
            <li>
              пользовательский интерфейс{' '}
              <a
                href="http://test.qiwi-artek.simbirsoft/"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://test.qiwi-artek.simbirsoft/
              </a>
            </li>
            <li>
              бекенд API{' '}
              <a
                href="http://test.qiwi-artek.simbirsoft:46101"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://test.qiwi-artek.simbirsoft:46101
              </a>
            </li>
            <li>
              PostgreSQL test.qiwi-artek.simbirsoft:46102 (artek:Uthu9pha)
            </li>
          </ul>

          <p dir="auto">Логи приложения:</p>

          <p dir="auto">DEV:</p>

          <ul dir="auto">
            <li>
              <a
                href="http://docker01.simbirsoft:5601"
                rel="nofollow noreferrer"
                target="_blank"
              >
                http://docker01.simbirsoft:5601
              </a>
            </li>
            <li>
              слева ждем стрелочку и выбираем индекс для окружения (artek_dev-<em
              >
                ,
                artek_test-
              </em>)
            </li>
          </ul>

          <p dir="auto">PROD:</p>

          <ul dir="auto">
            <li>
              <a
                href="https://admin.finabsolqt.ru/analytics/"
                rel="nofollow noreferrer"
                target="_blank"
              >
                https://admin.finabsolqt.ru/analytics/
              </a>{' '}
              (logger:hae2aSoo)
            </li>
            <li>
              Аналитика nginx(запросы и т.д. ){' '}
              <a
                href="https://admin.finabsolqt.ru/goaccess/index.html"
                rel="nofollow noreferrer"
                target="_blank"
              >
                https://admin.finabsolqt.ru/goaccess/index.html
              </a>{' '}
              (logger:hae2aSoo)
            </li>
          </ul>

          <p dir="auto">Учетные записи игротехников:</p>

          <ul dir="auto">
            <li>fingamemaster1 zoni21</li>
            <li>fingamemaster2 xizi64</li>
            <li>fingamemaster3 kupe67</li>
            <li>fingamemaster4 neko77</li>
            <li>fingamemaster5 sefo41</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectDescription;
