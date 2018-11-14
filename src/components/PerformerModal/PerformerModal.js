import React from 'react';
import PropTypes from 'prop-types';
import OptionsModal from '../OptionsModal';
import localize from './PerformerModal.json';

const PerformerModal = ({ defaultUser, users, onClose, onChoose, title, lang }) => (
  <OptionsModal
    defaultOption={defaultUser}
    options={users}
    inputPlaceholder={localize[lang].ENTER_PERFORMER_NAME}
    removeCurOptionTip={localize[lang].CANCEL_CURRENT_PERFORMER}
    onClose={onClose}
    onChoose={onChoose}
    title={title}
    canBeNotSelected
  />
);

PerformerModal.propTypes = {
  defaultUser: PropTypes.number,
  lang: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  users: PropTypes.array
};

export default PerformerModal;
