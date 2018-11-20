import React from 'react';
import PropTypes from 'prop-types';
import PerformerOptions from '../PerformerOptions';
import localize from './PerformerModal.json';

const PerformerModal = ({
  defaultUser,
  users,
  onClose,
  onChoose,
  title,
  isPerformerChanged,
  id,
  plannedExecutionTime,
  lang
}) => (
  <PerformerOptions
    defaultOption={defaultUser}
    options={users}
    inputPlaceholder={localize[lang].ENTER_PERFORMER_NAME}
    removeCurOptionTip={localize[lang].CANCEL_CURRENT_PERFORMER}
    onClose={onClose}
    onChoose={onChoose}
    title={title}
    canBeNotSelected
    isPerformerChanged={isPerformerChanged}
    plannedExecutionTime={plannedExecutionTime}
    id={id}
  />
);

PerformerModal.propTypes = {
  defaultUser: PropTypes.number,
  id: PropTypes.number,
  isPerformerChanged: PropTypes.bool,
  lang: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  plannedExecutionTime: PropTypes.string,
  title: PropTypes.string,
  users: PropTypes.array
};

export default PerformerModal;
