import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';

import TaskHeader from './TaskHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import Attachments from '../../components/Attachments';
import Description from '../../components/Description';
import RouteTabs from '../../components/RouteTabs';
import { TaskDescriptionText } from '../../mocks/descriptionText';

import * as css from './TaskPage.scss';

export default class TaskPage extends Component {

  render () {

    // Mocks

    const task = {
      id: 1,
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
              <Description text={TaskDescriptionText} headerType="h3" headerText="Описание:" />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments task={task} />
              <RouteTabs style={{marginTop: '2rem', marginBottom: '2rem'}}>
                <Link to={`/projects/${task.projectId}/tasks/${task.id}/comments`}>Комментарии</Link>
                <Link to={`/projects/${task.projectId}/tasks/${task.id}/history`}>История</Link>
              </RouteTabs>
              {this.props.children}
            </main>
          </Col>
          <Col xs={4}>
            <aside>
              <Details task={task} />
              <RelatedTasks task={task} type='related' />
              <RelatedTasks task={task} type='children' />
            </aside>
          </Col>
        </Row>
      </div>
    );
  }
}

TaskPage.propTypes = {
  children: PropTypes.object
};
