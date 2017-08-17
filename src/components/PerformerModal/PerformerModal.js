import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './PerformerModal.scss';
import Modal from '../Modal';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';

class PerformerModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      performer: this.props.defaultUser
    };
  }

  handleChoose = () => {
    this.props.onChoose(this.state.performer);
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  render () {
    const {
      title,
      onClose,
      users
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
              placeholder="Введите имя исполнителя..."
              multi={false}
              value={this.state.performer}
              onChange={e => this.selectValue(e !== null ? e.value : 0, 'performer')}
              noResultsText="Нет результатов"
              options={users}
            />
            <Button type="green" text="ОК" onClick={this.handleChoose}/>
          </div>
        </div>
      </Modal>
    );
  }
}

PerformerModal.propTypes = {
  defaultUser: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  users: PropTypes.array
};

export default PerformerModal;
