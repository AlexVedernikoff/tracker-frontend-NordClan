import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import TaskHeader from './TaskHeader';
import Details from './Details';
import RelatedTasks from './RelatedTasks';
import Attachments from '../../components/Attachments';
import Description from '../../components/Description';
import RouteTabs from '../../components/RouteTabs';
import { TaskDescriptionText } from '../../mocks/descriptionText';
import { getTask, startTaskEditing, stopTaskEditing, changeTask } from '../../actions/Task';

import * as css from './TaskPage.scss';

class TaskPage extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // TODO: change this to this.props.params.taskId
    const id = 4;

    const { getTask } = this.props;
    getTask(id);
  }

  render () {
    // Mocks

    const task = {
      id: 1,
      name: 'UI. Подготовка к демонстрации. Краткая проверка функционала',
      description:
        'Описание задачи, которое довольно часто может составлять пару предложений, а то и вовсе отсутствовать.',
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
            <TaskHeader task={this.props.task} />
            <main className={css.main}>
              <Description
                text={{ __html: this.props.task.description }}
                headerType="h3"
                id={4}
                headerText="Описание:"
                onEditStart={this.props.startTaskEditing}
                onEditFinish={this.props.stopTaskEditing}
                onEditSubmit={this.props.changeTask}
                isEditing={this.props.DescriptionIsEditing}
              />
              <hr />
              <h3>Прикрепленные файлы:</h3>
              <Attachments task={task} />
              <RouteTabs style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Link
                  to={`/projects/${task.projectId}/tasks/${task.id}/comments`}
                >
                  Комментарии
                </Link>
                <Link
                  to={`/projects/${task.projectId}/tasks/${task.id}/history`}
                >
                  История
                </Link>
              </RouteTabs>
              {this.props.children}
            </main>
          </Col>
          <Col xs={4}>
            <aside>
              <Details task={this.props.task} />
              <RelatedTasks task={task} type="related" />
              <RelatedTasks task={task} type="children" />
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

const mapStateToProps = state => ({
  task: state.Task.task,
  DescriptionIsEditing: state.Task.DescriptionIsEditing
});

const mapDispatchToProps = {
  getTask,
  startTaskEditing,
  stopTaskEditing,
  changeTask
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskPage);
