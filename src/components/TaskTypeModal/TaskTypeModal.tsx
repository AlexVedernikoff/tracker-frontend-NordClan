import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLocalizedTaskTypes } from '../../selectors/dictionaries';
import OptionsModal from '../OptionsModal';
import localize from './TaskTypeModal.json';

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

const TaskTypeModal = ({ onClose, taskTypes, defaultTypeId, onChoose, lang }) => (
  <OptionsModal
    defaultOption={defaultTypeId}
    onChoose={onChoose}
    onClose={onClose}
    title={localize[lang].CHANGE_TASK_TYPE}
    inputPlaceholder={localize[lang].CHOOSE_TASK_TYPE}
    options={getOptions(taskTypes)}
  />
);

TaskTypeModal.propTypes = {
  defaultTypeId: PropTypes.number,
  lang: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  {}
)(TaskTypeModal);
