import React, { FC } from 'react';
import * as info from './styles.scss';

export const Timesheets: FC = () => {
  return (
    <article className={info.article}>
      <h1>
        Заполнение ТШ
      </h1>

      <ol>
        <li>
          ТШ заполняются в корпоративном таск трекере <a href="">http://track.nordclan</a>
        </li>

        <li>
          Рекомендуется заполнять ТШ ежедневно в конце рабочего дня, чтобы потом судорожно не вспоминать, что было на прошлой неделе
        </li>

        <li>
          Каждый понедельник, до 12:00, необходимо проверить ТШ за прошлую неделю и отправить на аппрув
        </li>

        <li>
          ТШ апрувит руководитель каждую неделю, в понедельник после обеда
        </li>

        <li>
          Процесс заполнения ТШ:
          <ol>
            <li>
              Убедись, что у тебя есть таски. Все твои таски отображаются в пункте меню "My tasks" ("Мои задачи").
              <img
                src="/img/tasks.jpeg"
                alt="tasks"
              />
            </li>

            <li>
              Чтобы списать время перейди в пункт меню "Time reports" ("Отчеты по времени").
            </li>

            <li>
              Если у тебя пусто в ТШ или нет таски, на которую надо списать время, нажми на +
            </li>

            <li>
              В открывшемся окне в дропдауне "Activity type" (Тип активности) выбери тип Implementation. Этот тип для задач, которые связаны с твоей основной деятельностью (большинство твоих тасок будет именно с этим типом).
              <img
                src="/img/active-type.png"
                alt="active type"
              />

              <ol>
                <li>
                  Типы задач Meeting, Presale and estimation, Management, Education (Совещание, Преселлинг и оценка, Управление, Обучение) выбирай после согласования со своим руководителем или PM.
                </li>

                <li>
                  Тип Vacation (Отпуск) предназначен для списания времени (8 часов в день) на оплачиваемый и неоплачиваемый отпуск.
                </li>

                <li>
                  Тип On sick leave (Больничный) предназначен для списания времени (8 часов в день) на оплачиваемый больничный (оформленный больничным листом).
                </li>

                <li>
                  Тип Business trip (Командировка) предназначен для списания времени (8 часов в день) на командировку.
                </li>
              </ol>
            </li>

            <li>
              После выбора типа задачи необходимо выбрать таску в дропдауне "Task" (Задачи)

              <img
                src="/img/select-task.png"
                alt="select task"
              />
            </li>

            <li>
              Как правило, чекбокс должен быть чекнут, чтобы поиск совершался только по твоим таскам (в которых ты исполнитель). Если тебе надо списать время на таску, которая висит на другом человеке, то сделай чекбокс неактивным, выбери проект и спринт в появившихся дропдаунах и затем таску.

              <img
                src="/img/select-task-disable-checker.png"
                alt="disable checker"
              />
            </li>

            <li>
              Если твоя деятельность по таске не была связана с тестированием или ревью кода, то выбирай всегда Develop.
            </li>

            <li>
              Теперь твоя таска отображается в ТШ

              <img
                src="/img/ts-reports.png"
                alt="timesheets reports"
              />
            </li>

            <li>
              Чтобы добавить отработанные часы или минуты (или часы и минуты), нажми на квадрат (где пока отображается 0) и вбей нужную цифру.
            </li>

            <li>
              Как правило время на задачи вбивается от 30 минут (0,5 часа). Время лучше округлять, точность то минуты писать не обязательно (если это не требуется заказчиком). Если потратил чуть больше часа, можешь написать 1,5 и т.п.
            </li>

            <li>
              Каждое списанное время должно обязательно сопровождаться комментарием. Для этого в квадрате со временем есть икнока "Комментарий", которая горит серым, если ты еще ничего не написал, и зеленым, если ты добавил описание.
            </li>

            <li>
              Комментарий надо писать развернуто, чтобы руководитель, ПМ, тим-лид или заказчик мог понять, чем именно ты занимался в рамках затраченного времени.
            </li>

            <li>
              Ты можешь посмотреть сколько ты потратил времени за день, за неделю, на разные таски

              <ol>
                <li>
                  Общее время за день отображается в столбце (цифра 1 на скрине), время на таску отображается в строке с таской (цифра 2 на скрине), общее время за неделю отображается в строке под всеми тасками (цифра 3 на скрине)

                  <img
                    src="/img/ts-reports-selected.png"
                    alt="selected timesheets reports"
                  />
                </li>
              </ol>
            </li>

            <li>
              Обрати внимание, что за неделю у тебя должно быть списано 40 часов и, как правило, 8 часов в день (если не оговорены другие условия с руководителем или ПМ).
            </li>

            <li>
              Если тебе надо удалить таску, то наведи фокус на строку с нужной задачей и нажми на появившуюся иконку-крестик.

              <img
                src="/img/ts-reports-remove-task.png"
                alt="remove task"
              />
            </li>

            <li>
              Если ты заполнил все, что сделал, то можешь просто закрыть вкладку. <strong>НЕ НАЖИМАЙ Submit, если не хочешь отправить ТШ на апрув.</strong>
            </li>

            <li>
              Ты можешь редактировать время, таски, комментарии пока не нажал "Submit" (Подтвердить).
            </li>

            <li>
              Если же ты хочешь отправить на апрув результаты своей работы за неделю, то нажимай кнопку "Submit" (Подтвердить). Ты должен быть уверен, что все заполнил корректно. После этого действия, ты не сможешь отредактировать ТШ.

              <img
                src="/img/ts-reports-submit.jpeg"
                alt="reports submit"
              />
            </li>
          </ol>
        </li>
      </ol>
    </article>
  );
};
