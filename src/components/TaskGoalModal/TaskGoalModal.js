import React from 'react';
import PropTypes from 'prop-types';
import OptionsModal from '../OptionsModal';

const TaskGoalModal = ({ defaultGoal, goals, onClose, onChoose, title }) => (
  <OptionsModal
    defaultOption={defaultGoal}
    options={goals}
    inputPlaceholder="Введите название цели"
    removeCurOptionTip="Отменить текущую цель"
    onClose={onClose}
    onChoose={onChoose}
    title={title}
    canBeNotSelected
  />
);

TaskGoalModal.propTypes = {
  defaultGoal: PropTypes.number,
  goals: PropTypes.array,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default TaskGoalModal;
