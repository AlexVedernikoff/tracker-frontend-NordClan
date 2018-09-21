import React from 'react';
import PropTypes from 'prop-types';
import { getSprintMarkersClass } from '../../utils/markers';
import OptionsModal from '../OptionsModal';

const getOptions = sprints => {
  let options = [];

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
};

const SprintModal = ({ title, onClose, onChoose, sprints, defaultSprint }) => (
  <OptionsModal
    options={getOptions(sprints)}
    defaultOption={defaultSprint}
    inputPlaceholder="Введите название спринта..."
    onClose={onClose}
    onChoose={onChoose}
    title={title}
  />
);

SprintModal.propTypes = {
  defaultSprint: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  sprints: PropTypes.array,
  title: PropTypes.string
};

export default SprintModal;
