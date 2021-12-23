import React, { FC } from 'react';
import * as styles from './styles.scss';

export const LogTime: FC = () => {
  return (
    <article className={styles.article}>
      <h1>Как логировать время?</h1>

      <p>Ежедневно ты должен логировать время на выполненные тобой задачи.</p>

      <ol>
        <li>
          Зайди на <a href="http://track.nordclan/projects">http://track.nordclan/</a>
        </li>

        <li>
          Перейди в "Отчеты по времени"

          <img
            src="/img/report-by-time.png"
            alt="report by time"
          />
        </li>

        <li>
          Нажми кнопку "Добавить активность"

          <img
            src="/img/add-activity.png"
            alt="add activity"
          />
        </li>

        <li>
          Во всплывающем окне:

          <ol>
            <li>
              Выбери тип активности - если списываешь время на конкретную задачу, то выбираешь "Implementation"
            </li>

            <li>
              Чек-бокс "Только мои задачи" - если он установлен, то в списке задач будут отображаться те, у которых ты на момент заполнения являешься исполнителем
            </li>

            <li>
              Выбери задачу
            </li>

            <li>
              Выбери статус задачи - обычно это "Develop"
            </li>

            <li>
              Нажми кнопку "Добавить"

              <img
                src="/img/add-activity-action.png"
                alt="add activity action"
              />
            </li>
          </ol>
        </li>

        <li>
          Задача и затраченные часы должны появиться в списке отчетов по времени

          <img
            src="/img/task-in-stack.png"
            alt="task in stack"
          />
        </li>

        <li>
          Добавь комментарий - краткое описание того, что ты делал по задаче

          <img
            src="/img/comment-task.png"
            alt="task in stack"
          />

          <img
            src="/img/comment-task-full.png"
            alt="task in stack"
          />
        </li>

        <li>
          Повторяй пункты 3-6, чтобы залогировать время на все задачи и дни
        </li>

        <li>
          Каждую пятницу проверяй свои отчеты по времени.

          <p>
            Если все в порядке, нажми кнопку "Подтвердить" и иди навстречу своим долгожданным выходным.
          </p>

          <img
            src="/img/tasks-success.png"
            alt="task in stack"
          />
        </li>
      </ol>
    </article>
  );
};
