import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Col, Row } from 'react-flexbox-grid';
import moment from 'moment';
import classnames from 'classnames';
import _ from 'lodash';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import TextArea from '../../components/TextArea';
import SelectDropdown from '../../components/SelectDropdown';
import * as css from './Timesheets.scss';
import { closeCreateTaskModal, createTask } from '../../actions/Project';

class AddActivityModal extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps (nextProps) {}

  componentWillUnmount () {}

  render () {

    return (
      <Modal
        isOpen
        onRequestClose={this.props.onClose}
        contentLabel="Modal"
        closeTimeoutMS={200}
      >
        <div className={css.addActivityForm}>
          <h3>Добавить активность</h3>
          <hr/>
          <SelectDropdown/>
        </div>
      </Modal>
    );
  }
}

AddActivityModal.propTypes = {
  onClose: PropTypes.func
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityModal);
