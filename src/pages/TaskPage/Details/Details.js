import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import * as css from './Details.scss';
import moment from 'moment';

export default class Details extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { task } = this.props;
    const tags = task.tags.map((tag, i) => {
      return <Tag key={i}
                  name={tag}
                  taggable="task"
                  taggableId={task.id}/>;
    });

    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            {task.project
              ? <tr>
                  <td>Проект:</td>
                  <td>
                    <Link to={'/projects/' + this.props.task.project.id}>
                      {task.project.name}
                    </Link>
                  </td>
                </tr>
              : null}
            {task.sprint
              ? <tr>
                  <td>Спринт:</td>
                  <td>
                    <Link to="#">
                      {this.props.task.sprint.name}
                    </Link>
                  </td>
                </tr>
              : null}
            <tr>
              <td>Теги:</td>
              <td className={css.tags}>
                <Tags taggable="task"
                      taggableId={task.id}
                      create>
                  {tags}
                </Tags>
              </td>
            </tr>
            {task.author
              ? <tr>
                  <td>Автор:</td>
                  <td>
                    <Link to="#">
                      {this.props.task.creator
                        ? this.props.task.creator.name
                        : ''}
                    </Link>
                  </td>
                </tr>
              : null}
            {task.executor
              ? <tr>
                  <td>Исполнитель:</td>
                  <td>
                    <Link to="#">
                      {this.props.task.owner ? this.props.task.owner.name : ''}
                    </Link>
                  </td>
                </tr>
              : null}
            <tr>
              <td>Дата создания:</td>
              <td>
                {moment(this.props.task.createdAt).format('DD.MM.YYYY')}
              </td>
            </tr>
            {this.props.task.plannedExecutionTime
              ? <tr>
                  <td>Запланировано:</td>
                  <td>
                    {`${this.props.task.plannedExecutionTime} ч.`}
                  </td>
                </tr>
              : null}
            <tr>
              <td>Потрачено:</td>
              <td>
                <span
                  data-tip
                  data-place="right"
                  data-for="time"
                  className={classnames({
                    [css.alert]: true,
                    [css.factTime]: true
                  })}
                >
                  100 ч.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <ReactTooltip id="time" aria-haspopup="true" className="tooltip">
          <div className={css.timeString}>
            <span>Develop:</span>
            <span>1 ч.</span>
          </div>
          <div className={css.timeString}>
            <span>Code Review:</span>27 ч.
          </div>
          <div className={css.timeString}>
            <span>QA:</span>59 ч.
          </div>
        </ReactTooltip>
      </div>
    );
  }
}

Details.propTypes = {
  task: PropTypes.object.isRequired
};
