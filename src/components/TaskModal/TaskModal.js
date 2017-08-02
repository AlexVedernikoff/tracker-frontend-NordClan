import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TaskModal.scss';
import Modal from '../Modal';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';

class TaskModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      taskId: null
    };
  }

  handleChoose = () => {
    this.props.onChoose(this.state.taskId);
  }

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  render () {
    const {
      title,
      onClose,
      tasks
    } = this.props;

    return (
      <Modal
        isOpen
        contentLabel="modal"
        className={css.modalWrapper}
        onRequestClose={onClose}
      >
        <div className={css.changeStage}>
          <h3>{title}</h3>
          <div className={css.modalLine}>
            <SelectDropdown
              name="member"
              placeholder="Введите название задачи..."
              multi={false}
              value={this.state.taskId}
              onChange={e => this.selectValue(e !== null ? e.value : 0, 'taskId')}
              noResultsText="Нет результатов"
              options={tasks}
            />
            <Button type="green" text="ОК" onClick={this.handleChoose}/>
          </div>
        </div>
      </Modal>
    );
  }
}

TaskModal.propTypes = {
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  tasks: PropTypes.array,
  title: PropTypes.string
};

export default TaskModal;
