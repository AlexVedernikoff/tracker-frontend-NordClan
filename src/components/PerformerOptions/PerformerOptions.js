import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import * as css from './PerformerOptions.scss';
import Modal from '../Modal';
import SelectDropdown from '../SelectDropdown';
import { changeTask, publishComment, getTask } from '../../actions/Task';
import TaskTimesheet from './TaskTimesheet';
import MentionsInput from '../../pages/TaskPage/Comments/Mentions';
import { getFullName } from '../../utils/NameLocalisation';

import Button from '../Button';
import localize from './PerformerOptions.json';

import { prepairCommentForEdit } from '../../pages/TaskPage/Comments/Mentions/mentionService';

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
      commentText: ''
    };
  }

  componentDidMount() {
    const { id, task } = this.props;

    if (!task.id || task.id !== id) {
      this.props.getTask(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options, canBeNotSelected } = nextProps;
    const newOptions = this.getOptionsList(options, canBeNotSelected);

    this.setState({ options: newOptions }, () => {
      this.optionsList = newOptions;
    });
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
    this.setState({
      selectedPerformer: selectedPerformer ? selectedPerformer.value : 0
    });
  };

  changePerformer = e => {
    e.preventDefault();
    const { commentText } = this.state;
    console.log(commentText);
    const { id } = this.props;
    this.props.onChoose(this.state.selectedPerformer);
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
    return [
      { id: 'all', fullNameEn: localize.en.ALL, fullNameRu: localize.ru.ALL },
      ...this.props.projectUsers.map(u => u.user),
      ...this.props.externalUsers.map(u => u.user)
    ];
  }

  getTextAreaNode = node => {
    this.reply = node;
  };

  toggleBtn = evt => {
    this.setState({ disabledBtn: !evt.target.value || evt.target.value.trim() === '' });
  };

  render() {
    const { title, lang, task, activeUser } = this.props;
    console.log(this.users);
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
                    name="performer"
                    placeholder={localize[lang].PERFORMER_PLACEHOLDER}
                    multi={false}
                    className={css.selectPerformer}
                    value={this.state.selectedPerformer}
                    onChange={this.handlePerformerChange}
                    noResultsText={localize[lang].NO_RESULTS}
                    options={options}
                  />
                </Col>
              </Row>
            </label>

            {!this.props.isTshAndCommentsHidden &&
              task.statusId !== 1 &&
              activeUser.id === task.performerId && (
                <label className={css.formField}>
                  <Row className={css.taskFormRow}>
                    <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                      <p className={css.label}>{localize[lang].TIMESHEETS}</p>
                    </Col>

                    <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                      <TaskTimesheet userId={activeUser.id} />
                    </Col>
                  </Row>
                </label>
              )}

            {!this.props.isTshAndCommentsHidden &&
              task.statusId !== 1 &&
              activeUser.id === task.performerId && (
                <label className={css.formField}>
                  <Row className={css.taskFormRow}>
                    <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                      <p className={css.label}>{localize[lang].COMMENT}</p>
                    </Col>
                    <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                      <MentionsInput
                        placeholder={localize[lang].COMMENT_PLACEHOLDER}
                        value={prepairCommentForEdit(this.state.commentText, this.users)}
                        getTextAreaNode={this.getTextAreaNode}
                        toggleBtn={this.setComment}
                        className={css.resizeTrue}
                        suggestions={users}
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
  defaultOption: PropTypes.number,
  externalUsers: PropTypes.array,
  getTask: PropTypes.func,
  id: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  isPerformerChanged: PropTypes.bool,
  isProjectInfoReceiving: PropTypes.bool,
  isTshAndCommentsHidden: PropTypes.bool,
  lang: PropTypes.string,
  loggedTime: PropTypes.number,
  noCurrentOption: PropTypes.bool,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array,
  projectUsers: PropTypes.array,
  publishComment: PropTypes.func,
  removeCurOptionTip: PropTypes.string,
  task: PropTypes.object,
  taskId: PropTypes.number,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  activeUser: state.Auth.user,
  lang: state.Localize.lang,
  task: state.Task.task,
  projectUsers: state.Project.project.projectUsers,
  externalUsers: state.Project.project.externalUsers,
  isProjectInfoReceiving: state.Project.isProjectInfoReceiving
});

const mapDispatchToProps = {
  changeTask,
  publishComment,
  getTask
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformerOptions);
