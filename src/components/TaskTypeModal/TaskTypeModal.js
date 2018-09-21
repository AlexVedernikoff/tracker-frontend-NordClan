import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocalizedTaskTypes } from '../../selectors/dictionaries';
import OptionsModal from '../OptionsModal';

const getOptions = taskTypes => {
  const options = [];
  for (const type of taskTypes) {
    options.push({
      label: type.name,
      value: type.id
    });
  }

  return options;
};

const TaskTypeModal = ({ onClose, taskTypes, defaultTypeId, onChoose }) => (
  <OptionsModal
    defaultOption={defaultTypeId}
    onChoose={onChoose}
    onClose={onClose}
    title="Изменить тип задачи"
    inputPlaceholder="Выберите тип задачи..."
    options={getOptions(taskTypes)}
  />
);

TaskTypeModal.propTypes = {
  defaultTypeId: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  taskTypes: getLocalizedTaskTypes(state)
});

export default connect(
  mapStateToProps,
  {}
)(TaskTypeModal);
