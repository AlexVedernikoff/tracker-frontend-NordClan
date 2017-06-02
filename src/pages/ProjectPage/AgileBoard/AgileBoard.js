import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import TaskCard from '../../../components/TaskCard';
import * as css from './AgileBoard.scss';

export default class AgileBoard extends Component {
  static propTypes = {
  }

  render () {

    //Mocks

    const project = {
      prefix: 'MT',
      backLog: [
        {
          name: 'Название таски',
          id: 3214,
          status: 'INPROGRESS',
          executor: 'Исполнитель Одноклассница',
          priority: 1
        }
      ],
      activeSprint: {
        id: 123,
        name: 'Спринт №1',
        dateStart: '01.06.2017',
        dateEnd: '30.06.2017',
        status: 'active',
        tasksMine: {
          new: [
            {
              name: 'Название таски',
              id: 3214,
              status: 'INPROGRESS',
              executor: 'Исполнитель Одноклассница',
              priority: 2
            }
          ]
        },
        tasksOther: {
          new: [
            {
              name: 'Название таски',
              id: 'Id таски',
              status: 'In Progress',
              executor: 'Исполнитель Одноклассница',
              priority: 2
            }
          ]
        }
      }
    };

    return (
      <section className={css.agileBoard}>
        <Row>
          <Col xs={2}>
            <h2>BackLog</h2>
            <div>
              <TaskCard task={project.backLog[0]}/>
              <TaskCard task={project.backLog[0]}/>
              <TaskCard task={project.backLog[0]}/>
              <TaskCard task={project.backLog[0]}/>
              <TaskCard task={project.backLog[0]}/>
              <TaskCard task={project.backLog[0]}/>
            </div>
          </Col>
          <Col xs={10}>
            <h2>{project.activeSprint.name} ({project.activeSprint.dateStart} - {project.activeSprint.dateEnd})</h2>
            <h3>Мои задачи</h3>
            <Row>
              <Col xs>
                <h4>New</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Develop</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Code Review</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>QA</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Done</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
            </Row>
            <h3>Прочие</h3>
            <Row>
              <Col xs>
                <h4>New</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Develop</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Code Review</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>QA</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
              <Col xs>
                <h4>Done</h4>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
                <TaskCard task={project.activeSprint.tasksMine.new[0]}/>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    );
  }
}
