import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import * as css from './PerformerOptions.scss';
import Modal from '../Modal';
import SelectDropdown from '../SelectDropdown';
import { changeTask, publishComment, getTask } from '../../actions/Task';
import { changeWeek } from '../../actions/Timesheets';
import TaskTimesheet from './TaskTimesheet';
import MentionsInput from '../../pages/TaskPage/Comments/Mentions';
import { getFullName } from '../../utils/NameLocalisation';
import { isTimesheetsCanBeChanged } from '../../utils/Timesheets';

import Button from '../Button';
import localize from './PerformerOptions.json';
import { TASK_STATUSES } from '../../constants/TaskStatuses';
import union from 'lodash/union';

import { prepairCommentForEdit, stringifyCommentForSend } from '../../pages/TaskPage/Comments/Mentions/mentionService';
import moment from 'moment';

const formLayout = {
  firstCol: 3,
  secondCol: 9
};

class PerformerOptions extends Component {
  constructor(props) {
    super(props);

    const { options, canBeNotSelected } = props;
    this.optionsList = this.getOptionsList(options, canBeNotSelected);

    this.state = {
      options: this.optionsList,
      loggedTime: 0,
      selectedPerformer: props.defaultOption || null,
      commentText: '',
      inputValue: ''
    };
  }

  componentDidMount() {
    const { id, task, activeUser, isTshAndCommentsHidden } = this.props;

    if (!task.id || task.id !== id) {
      this.props.getTask(id);
    }

    if (!isTshAndCommentsHidden) {
      this.props.changeWeek(moment(), activeUser.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options, canBeNotSelected, isTshAndCommentsHidden, activeUser, startingDay } = nextProps;
    const newOptions = this.getOptionsList(options, canBeNotSelected);

    this.setState({ options: newOptions }, () => {
      this.optionsList = newOptions;
    });

    const timesheetChanged = nextProps.list !== this.props.list;

    if (
      !isTshAndCommentsHidden &&
      timesheetChanged &&
      !isTimesheetsCanBeChanged(nextProps.list, this.props.startingDay)
    ) {
      this.props.changeWeek(startingDay.add(7, 'days'), activeUser.id);
    }
  }

  getOptionsList(options, canBeNotSelected) {
    const optionsList = [...options];
    return canBeNotSelected
      ? optionsList.concat({
          value: 0,
          label: localize[this.props.lang].NOT_SELECTED
        })
      : optionsList;
  }

  onClose = () => {
    this.props.onClose();
  };

  handlePerformerChange = selectedPerformer => {
    let newOptions = [...this.state.options];
    if (selectedPerformer && !newOptions.find(opt => opt.value === selectedPerformer.value)) {
      newOptions = union(newOptions, [selectedPerformer]);
      this.setState({
        options: newOptions
      });
    } else {
      this.removeRestUsersFromOptions();
    }
    this.setState({
      selectedPerformer: selectedPerformer ? selectedPerformer.value : null
    });
  };

  changePerformer = e => {
    e.preventDefault();
    const commentText = stringifyCommentForSend(this.state.commentText, this.users);
    const { id } = this.props;
    this.props.onChoose(this.state.selectedPerformer || 0);
    if (commentText) {
      this.props.publishComment(id, {
        text: commentText
      });
    }
  };

  setComment = e => {
    this.setState({
      commentText: e.target.value
    });
  };

  get users() {
    const { options } = this.state;
    let projectUsers = this.props.projectUsers;
    const externalUsers = this.props.externalUsers;
    if (!projectUsers) {
      projectUsers = [];

      if (options && options.length) {
        options.forEach(user => {
          if (user.value) {
            projectUsers.push({
              user: {
                ...user,
                login: user.label,
                id: user.value
              }
            });
          }
        });
      }
    }
    return [
      { id: 'all', fullNameEn: localize.en.ALL, fullNameRu: localize.ru.ALL },
      ...(Array.isArray(projectUsers) && projectUsers.map(u => u.user)),
      ...(Array.isArray(externalUsers) && externalUsers.map(u => u.user))
    ];
  }

  getTextAreaNode = node => {
    this.reply = node;
  };

  toggleBtn = evt => {
    this.setState({ disabledBtn: !evt.target.value || evt.target.value.trim() === '' });
  };

  handleInputChange = e => {
    const { inputValue } = this.state;
    if (!inputValue && e) {
      this.addRestUsersToOptions();
    } else if (inputValue && !e) {
      this.removeRestUsersFromOptions();
    }

    this.setState({ inputValue: e });
  };

  addRestUsersToOptions = () => {
    const { options, canBeNotSelected, restUsers } = this.props;
    const newOptions = this.getOptionsList(union(options, restUsers), canBeNotSelected);
    this.setState({ options: newOptions }, () => {
      this.optionsList = newOptions;
    });
  };

  removeRestUsersFromOptions = () => {
    const { options, canBeNotSelected } = this.props;
    const newOptions = this.getOptionsList(options, canBeNotSelected);
    this.setState({ options: newOptions }, () => {
      this.optionsList = newOptions;
    });
  };

  render() {
    const { title, lang, task, activeUser, isTshAndCommentsHidden } = this.props;
    const { options } = this.state;
    const users = this.users.map(u => ({ id: u.id, display: getFullName(u) }));
    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={this.onClose}>
        <div>
          <div className={css.header}>
            <h3>{title}</h3>
          </div>
          <form className={css.createTaskForm}>
            <label className={css.formField}>
              <Row className={css.taskFormRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p className={css.label}>{localize[lang].PERFORMER}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <SelectDropdown
                    autoFocus
                    name="performer"
                    placeholder={localize[lang].PERFORMER_PLACEHOLDER}
                    multi={false}
                    className={css.selectPerformer}
                    value={this.state.selectedPerformer}
                    onChange={this.handlePerformerChange}
                    noResultsText={localize[lang].NO_RESULTS}
                    options={options}
                    onInputChange={this.handleInputChange}
                    autofocus
                  />
                </Col>
              </Row>
            </label>

            {!isTshAndCommentsHidden &&
              task.statusId !== TASK_STATUSES.NEW &&
              activeUser.id === task.performerId && (
                <div className={css.formField}>
                  <Row className={css.taskFormRow}>
                    <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                      <p className={css.label}>{localize[lang].TIMESHEETS}</p>
                    </Col>

                    <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                      <TaskTimesheet userId={activeUser.id} />
                    </Col>
                  </Row>
                </div>
              )}

            {!isTshAndCommentsHidden &&
              task.statusId !== TASK_STATUSES.NEW &&
              activeUser.id === task.performerId && (
                <label className={css.formField}>
                  <Row className={css.taskFormRow}>
                    <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                      <p className={css.label}>{localize[lang].COMMENT}</p>
                    </Col>
                    <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                      <MentionsInput
                        className={css.taskCommentInput}
                        placeholder={localize[lang].COMMENT_PLACEHOLDER}
                        value={prepairCommentForEdit(this.state.commentText, this.users)}
                        getTextAreaNode={this.getTextAreaNode}
                        toggleBtn={this.setComment}
                        suggestions={users}
                        autoFocus={false}
                      />
                    </Col>
                  </Row>
                </label>
              )}

            <div className={css.changePerformerButton}>
              <Button
                text={localize[lang].CHANGE_PERFORMER}
                type="green"
                htmlType="submit"
                onClick={this.changePerformer}
              />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

PerformerOptions.propTypes = {
  activeUser: PropTypes.object,
  canBeNotSelected: PropTypes.bool,
  changeTask: PropTypes.func,
  changeWeek: PropTypes.func,
  defaultOption: PropTypes.number,
  externalUsers: PropTypes.array,
  getTask: PropTypes.func,
  id: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  isPerformerChanged: PropTypes.bool,
  isProjectInfoReceiving: PropTypes.bool,
  isTshAndCommentsHidden: PropTypes.bool,
  lang: PropTypes.string,
  list: PropTypes.array,
  loggedTime: PropTypes.number,
  noCurrentOption: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array,
  projectUsers: PropTypes.array,
  publishComment: PropTypes.func,
  removeCurOptionTip: PropTypes.string,
  restUsers: PropTypes.array,
  startingDay: PropTypes.object,
  task: PropTypes.object,
  taskId: PropTypes.number,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  activeUser: state.Auth.user,
  lang: state.Localize.lang,
  list: state.Timesheets.list,
  task: state.Task.task,
  projectUsers: state.Project.project.projectUsers,
  startingDay: state.Timesheets.startingDay,
  externalUsers: state.Project.project.externalUsers,
  isProjectInfoReceiving: state.Project.isProjectInfoReceiving
});

const mapDispatchToProps = {
  changeTask,
  changeWeek,
  publishComment,
  getTask
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformerOptions);
