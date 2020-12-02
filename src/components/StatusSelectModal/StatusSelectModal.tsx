import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OptionsModal from '../OptionsModal';
import localize from './StatusSelectModal.json';

const StatusSelectModal = ({ onClose, defaultValue, onChoose, lang, options }) => (
  <OptionsModal
    defaultOption={defaultValue}
    onChoose={onChoose}
    onClose={onClose}
    title={localize[lang].CHANGE_STATUS}
    inputPlaceholder={localize[lang].CHOOSE_STATUS}
    options={options}
  />
);

(StatusSelectModal as any).propTypes = {
  defaultValue: PropTypes.number,
  lang: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  options: PropTypes.array
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  {}
)(StatusSelectModal);
