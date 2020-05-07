import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '../../components/Modal';
import Validator from '../../components/ValidatedInput/Validator';
import * as css from './CreateTestCaseModal.scss';

class CreateTestCaseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
    this.validator = new Validator();
  }
  render() {
    const { onCancel, closeTimeoutMS, ...other } = this.props;
    return (
      <Modal {...other} onRequestClose={onCancel} closeTimeoutMS={200 || closeTimeoutMS}>
        <form className={css.createTaskForm} />
      </Modal>
    );
  }
}

CreateTestCaseModal.propTypes = {
  closeTimeoutMS: PropTypes.number,
  onCancel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
