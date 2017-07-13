import React, { Component } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import Input from '../../../components/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import * as css from './CreateTask.scss';
import { Col, Row } from 'react-flexbox-grid';

class CreateTask extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedSprint: null,
      sprints: null
    };
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.selectedSprint) {
      this.setState({
        selectedSprint: nextProps.selectedSprintValue
      });
    }
    if (!this.state.sprints) {
      this.setState({
        sprints: nextProps.optionsList
      })
    }
  }

  handleModalSprintChange = selectedSprint => {
    console.log('event eboshit');
    this.setState({
      selectedSprint: selectedSprint.value,
      sprints: this.state.sprints.map(sprint => ({
        ...sprint,
        disabled:
          _.isEqual(selectedSprint, sprint)
          || this.state.selectedSprint === sprint.value
            ? !sprint.disabled
            : sprint.disabled
      }))
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
        height: 350,
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
                <p>{`${this.props.project.name} (${this.props.project
                  .prefix})`}</p>
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
                  // onChange={this.props.onChange}
                  name="taskName"
                  placeholder="Название задачи"
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
                <Checkbox name="openProjectPage" />
                {/* // onChange={this.props.handleCheckBox} */}
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
                  options={this.state.sprints}
                  className={css.selectSprint}
                  onChange={this.handleModalSprintChange}
                  value={this.state.selectedSprint}
                  // loadOptions={this.getPortfolios}
                  // onChange={this.props.onPortfolioSelect}
                  // value={this.props.selectedPortfolio}
                  // className={css.selectSprint}
                />
              </Col>
            </Row>
          </label>
          <div className={css.buttonsContainer}>
            <Button
              text="Создать проект"
              type="green"
              style={{ width: '50%' }}
              onClick={this.props.onSubmit}
            />
            <Button
              text="Назад"
              type="primary"
              style={{ width: '50%' }}
              onClick={this.closeModal}
            />
          </div>
        </form>
      </Modal>
    );
  }
}

export default CreateTask;
