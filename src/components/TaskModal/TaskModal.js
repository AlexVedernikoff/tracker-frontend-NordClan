import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './TaskModal.json';
import OptionsModal from '../OptionsModal';

const TaskModal = ({ title, onClose, tasks, lang, onChoose }) => (
  <OptionsModal
    options={tasks}
    noCurrentOption
    title={title}
    onClose={onClose}
    onChoose={onChoose}
    inputPlaceholder={localize[lang].ENTER_NAME}
  />
);

TaskModal.propTypes = {
  lang: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  tasks: PropTypes.array,
  title: PropTypes.string
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(TaskModal);
