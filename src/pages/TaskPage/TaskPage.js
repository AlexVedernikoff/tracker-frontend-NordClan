import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import TaskHeader from './TaskHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import TaskHistory from './TaskHistory';
import Attachments from '../../components/Attachments';
import Comments from './Comments';
import Description from "../../components/Description";
import { TaskDescriptionText } from "../../mocks/descriptionText";

import * as css from './TaskPage.scss';

export default class TaskPage extends Component {
  static propTypes = {
  }

  render () {

    // Mocks

    const task = {
      name: 'UI. Подготовка к демонстрации. Краткая проверка функционала',
      description: 'Описание задачи, которое довольно часто может составлять пару предложений, а то и вовсе отсутствовать.',
      projectName: 'MakeTalents',
      projectId: 1,
      sprint: 'Спринт 1',
      tags: ['UI', 'ReFactor', 'Demo'],
      creator: {
        name: 'Виссарион Одноклассница'
      },
      owner: {
        name: 'Андрей Юдин'
      },
      parentTask: {
        name: 'UI: Add to gulp build tasks for css and js minification',
        prefix: ''
      }
    };

    return (
      <div id="task-page">
        <Row>
          <Col xs={8}>
            <TaskHeader task={task}/>
            <main className={css.main}>
              <Description text={TaskDescriptionText} />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments task={task} />
              <hr />
              <Comments />
            </main>
          </Col>
          <Col xs={4}>
            <aside>
              <Details task={task} />
              <RelatedTasks task={task} type='related' />
              <RelatedTasks task={task} type='children' />
              <TaskHistory task={task} />
            </aside>
          </Col>
        </Row>
      </div>
    );
  }
}
