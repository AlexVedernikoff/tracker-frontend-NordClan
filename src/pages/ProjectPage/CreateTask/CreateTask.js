import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Select from 'react-select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import moment from 'moment';
import classnames from 'classnames';
import * as css from './CreateTask.scss';
import { Col, Row } from 'react-flexbox-grid';
import Priority from '../../TaskPage/Priority';

class CreateTask extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedSprint: null,
      taskName: null,
      openTaskPage: false,
      prioritiesId: 3,
      types: [{ label: 'Фича', value: 1 }, { label: 'Баг', value: 2 }],
      selectedType: { label: 'Фича', value: 1 }
    };
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.selectedSprint) {
      this.setState({
        selectedSprint: nextProps.selectedSprintValue
      });
    }
  }

  componentWillUnmount () {
    this.setState({
      selectedSprint: null,
      sprints: null,
      taskName: null,
      openTaskPage: false
    });
  }

  handleModalSprintChange = selectedSprint => {
    this.setState({
      selectedSprint: selectedSprint !== null ? selectedSprint.value : 0
    });
  };

  handleInput = event => {
    this.setState({
      taskName: event.target.value
    });
  };

  handlePriorityChange = priorityId => {
    this.setState({
      prioritiesId: +priorityId
    });
  };

  handleCheckBox = event => {
    const { checked } = event.target;
    this.setState({
      openTaskPage: checked
    });
  };

  handleClose = event => {
    event.preventDefault();
    this.props.onRequestClose();
  }

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprintsList, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 1,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 2
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: true,
        [css.sprintMarker]: true
      })
    });
    return sprints;
  };

  submitTask = event => {
    event.preventDefault();
    this.props.onSubmit(
      {
        name: this.state.taskName,
        projectId: this.props.project.id,
        statusId: 1,
        typeId: this.state.selectedType.value,
        sprintId:
          this.state.selectedSprint === 0 ? null : this.state.selectedSprint,
        prioritiesId: this.state.prioritiesId,
        parentId: this.props.parentTaskId
      },
      this.state.openTaskPage,
      this.props.column
    );
  };

  onTypeChange = value => {
    this.setState({
      selectedType: value
    });
  };

  render () {
    const { isOpen, onRequestClose } = this.props;
    const ReactModalStyles = {
      overlay: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        padding: '1rem',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(43, 62, 80, 0.8)',
        zIndex: 2,
        overflow: 'auto'
      },
      content: {
        position: 'relative',
        top: 'initial',
        bottom: 'initial',
        left: 'initial',
        right: 'initial',
        boxSizing: 'border-box',
        border: 'none',
        background: '#fff',
        overflow: 'visi',
        WebkitOverflowScrolling: 'touch',
        borderRadius: 0,
        outline: 'none',
        padding: 0,
        width: 500,
        height: 400,
        maxHeight: '100%'
      }
    };

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Modal"
        closeTimeoutMS={200}
        style={ReactModalStyles}
      >
        <form className={css.createTaskForm}>
          <div className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Проект:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <p>{`${this.props.project.name} (${this.props.project.prefix})`}</p>
              </Col>
            </Row>
          </div>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Название задачи:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  autoFocus
                  onChange={this.handleInput}
                  name="taskName"
                  placeholder="Название задачи"
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Тип задачи:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  multi={false}
                  ignoreCase={false}
                  placeholder="Выберите спринт"
                  options={this.state.types}
                  className={css.selectSprint}
                  value={this.state.selectedType}
                  onChange={this.onTypeChange}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Приоритет:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Priority
                  priority={this.state.prioritiesId}
                  onPrioritySet={this.handlePriorityChange}
                  text={''}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Открыть страницу задачи</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Checkbox
                  name="openProjectPage"
                  onChange={this.handleCheckBox}
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={formLayout.firstCol} className={css.leftColumn}>
                <p>Добавить задачу в спринт:</p>
              </Col>
              <Col xs={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  promptTextCreator={label => `Создать спринт '${label}'`}
                  searchPromptText={'Введите название спринта'}
                  multi={false}
                  ignoreCase={false}
                  placeholder="Выберите спринт"
                  options={this.getSprints()}
                  className={css.selectSprint}
                  onChange={this.handleModalSprintChange}
                  value={this.state.selectedSprint}
                />
              </Col>
            </Row>
          </label>
          <div className={css.buttonsContainer}>
            <Button
              text="Создать задачу"
              type="green"
              style={{ width: '50%' }}
              onClick={this.submitTask}
            />
            <Button
              text="Назад"
              type="primary"
              style={{ width: '50%' }}
              onClick={this.handleClose}
            />
          </div>
        </form>
      </Modal>
    );
  }
}

CreateTask.propTypes = {
  column: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  parentTaskId: PropTypes.number,
  project: PropTypes.object,
  selectedSprintValue: PropTypes.number,
  sprintsList: PropTypes.array
};

export default CreateTask;
