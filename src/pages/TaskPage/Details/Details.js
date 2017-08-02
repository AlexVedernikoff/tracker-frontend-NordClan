import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import TaskPlanningTime from '../TaskPlanningTime';
import PerformerModal from '../../../components/PerformerModal';
import { getProjectUsers } from '../../../actions/Project';
import { connect } from 'react-redux';
import * as css from './Details.scss';
import moment from 'moment';

class Details extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  openModal = () => {
    this.props.getProjectUsers(this.props.task.project.id);
    this.setState({ isModalOpen: true });
  }

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  changePerformer = (performerId) => {
    this.props.onChangeUser(this.props.task.id, performerId);
    this.closeModal();
  }

  render () {
    const { task } = this.props;
    const tags = task.tags.map((tag, i) => {
      return <Tag key={i}
                  name={tag}
                  taggable="task"
                  taggableId={task.id}/>;
    });

    const users = this.props.users.map(item => ({
      value: item.user ? item.user.id : item.id,
      label: item.user ? item.user.fullNameRu : item.fullNameRu
    }));

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
              <tr>
                <td>Спринт:</td>
                <td>
                    <Link to={`/projects/${task.projectId}/agile-board`}>
                      {task.sprint ? task.sprint.name : 'Backlog'}
                    </Link>
                </td>
              </tr>
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
                     task.author.fullNameRu
                  </td>
                </tr>
              : null}
              <tr>
                <td>Исполнитель:</td>
                <td>
                  <a onClick={this.openModal}>
                    { task.performer
                      ? task.performer.fullNameRu
                      : <span className={css.unassigned}>Не назначено</span>
                    }
                  </a>
                </td>
              </tr>
            <tr>
              <td>Дата создания:</td>
              <td>
                {moment(this.props.task.createdAt).format('DD.MM.YYYY')}
              </td>
            </tr>
            <tr>
              <td>Запланировано:</td>
              <td>
                <TaskPlanningTime time={task.plannedExecutionTime ? task.plannedExecutionTime : 0} id={task.id} />
              </td>
            </tr>
            { task.factExecutionTime
              ? <tr>
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
                       {`${task.factExecutionTime} ч.`}
                    </span>
                  </td>
                </tr>
              : null }
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

        {
          this.state.isModalOpen
          ? <PerformerModal
              defaultUser={task.performer ? task.performer.id : null}
              onChoose={this.changePerformer}
              onClose={this.closeModal}
              title="Изменить исполнителя задачи"
              users={users}
            />
          : null
        }
      </div>
    );
  }
}

Details.propTypes = {
  getProjectUsers: PropTypes.func.isRequired,
  onChangeUser: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  users: PropTypes.array
};


const mapStateToProps = state => ({
  users: state.Project.project.users
});

const mapDispatchToProps = {
  getProjectUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
