import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TaskTypeModal.scss';
import Modal from '../Modal';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';
import TaskTypes from '../../constants/TaskTypes';

class TaskTypeModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      typeId: this.props.defaultTypeId
    };
  }

  handleChoose = () => {
    this.props.onChoose(this.state.typeId);
  };

  selectValue = (value) => {
    this.setState({ typeId: value });
  };

  render () {
    const {
      onClose
    } = this.props;

    const options = [];

    for (const id in TaskTypes) {
      options.push({
        label: TaskTypes[id],
        value: parseInt(id)
      });
    }

    return (
      <Modal
        isOpen
        contentLabel="modal"
        className={css.modalWrapper}
        onRequestClose={onClose}
      >
        <div className={css.changeStage}>
          <h3>Заголовок</h3>
          <div className={css.modalLine}>
            <SelectDropdown
              name="member"
              placeholder="Выберите тип задачи..."
              multi={false}
              value={this.state.typeId}
              onChange={e => this.selectValue(e !== null ? e.value : 1)}
              noResultsText="Нет результатов"
              options={options}
            />
            <Button type="green" text="ОК" onClick={this.handleChoose}/>
          </div>
        </div>
      </Modal>
    );
  }
}

TaskTypeModal.propTypes = {
  defaultTypeId: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TaskTypeModal;
