import React from 'react';
import PropTypes from 'prop-types';
import OptionsModal from '../OptionsModal';

const PerformerModal = ({ defaultUser, users, onClose, onChoose, title }) => (
  <OptionsModal
    defaultOption={defaultUser}
    options={users}
    inputPlaceholder="Введите имя исполнителя"
    removeCurOptionTip="Отменить текущего исполнителя"
    onClose={onClose}
    onChoose={onChoose}
    title={title}
    canBeNotSelected
  />
);

PerformerModal.propTypes = {
  defaultUser: PropTypes.number,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  users: PropTypes.array
};

export default PerformerModal;
