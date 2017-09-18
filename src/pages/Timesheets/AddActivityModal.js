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

  static propTypes = {
    activityTypes: PropTypes.array
  }

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
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={5}>
                Тип активности:
              </Col>
              <Col xs={12} sm={7}>
                <SelectDropdown
                  multi={false}
                  value={1}
                  placeholder="Тип активности"
                  options={
                    this.props.activityTypes.length
                    ? this.props.activityTypes.map(
                        element => {return {label: element.name, value: element.id};}
                      )
                    : null
                  }
                />
              </Col>
            </Row>
          </label>
          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={5}>
                Проект / Задача:
              </Col>
              <Col xs={12} sm={7}>
                <SelectDropdown
                  multi={false}
                  placeholder="Выбрать проект / задачу"
                  options=""
                />
              </Col>
            </Row>
          </label>
          <div className={css.footer}>
            <Button
              text="Добавить"
              htmlType="submit"
              type="green"
            />
          </div>
        </div>
      </Modal>
    );
  }
}

AddActivityModal.propTypes = {
  onClose: PropTypes.func
};

const mapStateToProps = state => ({
  activityTypes: state.Dictionaries.magicActivityTypes
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddActivityModal);
