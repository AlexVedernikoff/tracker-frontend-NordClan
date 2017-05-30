import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import TaskCardHeader from './TaskCardHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import TaskHistory from './TaskHistory';
import Attachments from './Attachments';
import Comments from './Comments';

import * as css from './TaskPage.scss';

export default class TaskPage extends Component {
  static propTypes = {
  }

  render () {

    // Mocks

    const task = {
      name: 'UI. Подготовка к демонстрации. Краткая проверка функционала',
      projectName: 'Название проекта',
      creator: {
        name: 'Имя создателя'
      },
      owner: {
        name: 'Имя исполнителя'
      }
    };

    return (
      <div id="task-page">
        <h1 title="Название задачи" />
            <Row>
              <Col xs={8}>
                <TaskCardHeader task={task}/>
                <main className={css.main}>
                  <div className={css.description}>
                    Описание задачи, которое довольно часто может составлять пару предложений.
                  </div>
                  <hr />
                  <Attachments task={task} />
                  <hr />
                  <Comments />
                </main>
              </Col>
              <Col xs={4}>
                <aside>
                  <Details task={task} />
                  <RelatedTasks task={task} />
                  <TaskHistory task={task} />
                </aside>
              </Col>
            </Row>
      </div>
    );
  }
}
