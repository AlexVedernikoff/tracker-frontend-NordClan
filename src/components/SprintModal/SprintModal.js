import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './SprintModal.scss';
import Modal from '../Modal';
import Button from '../Button';
import SelectDropdown from '../SelectDropdown';
import { getSprintMarkersClass } from '../../utils/markers';

class SprintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprint: this.props.defaultSprint
    };
  }

  handleChoose = () => {
    this.props.onChoose(this.state.sprint);
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e });
  };

  get options() {
    let options = [];
    const { sprints } = this.props;

    if (sprints) {
      options = sprints.map(sprint => ({
        label: sprint.name,
        value: sprint.id,
        className: getSprintMarkersClass(sprint.statusId)
      }));
    }

    options.push({
      label: 'Backlog',
      value: 0,
      className: getSprintMarkersClass()
    });

    return options;
  }

  render() {
    const { title, onClose } = this.props;

    return (
      <Modal isOpen contentLabel="modal" className={css.modalWrapper} onRequestClose={onClose}>
        <div className={css.changeStage}>
          <h3>{title}</h3>
          <div className={css.modalLine}>
            <SelectDropdown
              name="member"
              placeholder="Введите название спринта..."
              multi={false}
              value={this.state.sprint}
              onChange={e => this.selectValue(e !== null ? e.value : 0, 'sprint')}
              noResultsText="Нет результатов"
              options={this.options}
              autoFocus
              openOnFocus
            />
            <Button type="green" text="ОК" onClick={this.handleChoose} />
          </div>
        </div>
      </Modal>
    );
  }
}

SprintModal.propTypes = {
  defaultSprint: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  sprints: PropTypes.array,
  title: PropTypes.string
};

export default SprintModal;
