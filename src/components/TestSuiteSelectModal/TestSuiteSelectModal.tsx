import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OptionsModal from '../OptionsModal';
import localize from './TestSuiteSelectModal.json';

const TestSuiteSelectModal = ({ onClose, defaultValue, onChoose, lang, options }) => (
  <OptionsModal
    defaultOption={defaultValue}
    onChoose={onChoose}
    onClose={onClose}
    title={localize[lang].CHANGE_TEST_SUITE}
    inputPlaceholder={localize[lang].CHOOSE_TEST_SUITE}
    options={options}
  />
);

(TestSuiteSelectModal as any).propTypes = {
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
)(TestSuiteSelectModal);
