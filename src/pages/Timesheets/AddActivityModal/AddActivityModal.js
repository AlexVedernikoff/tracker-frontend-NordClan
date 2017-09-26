import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Row } from 'react-flexbox-grid';
import Select from 'react-select';
import axios from 'axios';
import classnames from 'classnames';
import _ from 'lodash';
import { API_URL } from '../../../constants/Settings';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import * as css from '../Timesheets.scss';

class AddActivityModal extends Component {

  static propTypes = {
    activityTypes: PropTypes.array
  }

  constructor (props) {
    super(props);
    this.state = {
      activityType: 0,
      taskId: 0,
      projectId: 0,
      taskStatusId: 0
    };
  }

  componentWillReceiveProps (nextProps) {}

  componentWillUnmount () {}

  changeItem = (option, name) => {
    if (option) {
      this.setState({ [name]: option.value });
      if (name === 'activityType' && option.value !== 1) {
        this.setState({ 'taskId': 0 });
      }
    } else {
      this.setState({ [name]: 0 });
    }
  }

  getTasks (name = '') {
    return axios
      .get(
        `${API_URL}/task`,
        { params: { name } },
        { withCredentials: true }
      )
      .then(response => response.data.data)
      .then(tasks => ({
        options: tasks.map((task) => ({
          label: task.name,
          value: task.id
        }))
      }));
  }

  changeTask (e) {
    console.log(e);
  }

  render () {

    const formLayout = {
      left: 5,
      right: 7
    };

    const SelectAsync = Select.AsyncCreatable;

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
              <Col xs={12} sm={formLayout.left}>
                Тип активности:
              </Col>
              <Col xs={12} sm={formLayout.right}>
                <SelectDropdown
                  multi={false}
                  value={this.state.activityType}
                  placeholder="Тип активности"
                  onChange={(option) => this.changeItem(option, 'activityType')}
                  options={
                    this.props.activityTypes.length
                    ? this.props.activityTypes.map(
                        element => {return {label: element.name, value: element.id};}
                      ).concat([{ value: 0, label: 'Не выбрано' }])
                    : null
                  }
                />
              </Col>
            </Row>
          </label>
          {
            this.state.activityType && this.state.activityType === 1
            ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Задача:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    {/* <SelectDropdown
                      multi={false}
                      value={this.state.taskId}
                      onChange={(option) => this.changeItem(option, 'taskId')}
                      placeholder="Введите название задачи"
                      options={[
                        {value: 1, label: 'Тестовая задача'},
                        {value: 0, label: 'Не выбрано'}
                      ]}
                    /> */}
                    <SelectAsync
                      promptTextCreator={label => `Поиск задачи ${label}`}
                      searchPromptText={'Введите название Задачи'}
                      multi={false}
                      ignoreCase={false}
                      placeholder="Выберите задачу"
                      loadOptions={this.getTasks}
                      filterOption={el => el}
                      onChange={e => this.changeTask(e)}
                    />
                  </Col>
                </Row>
              </label>
            : this.state.activityType && this.state.activityType !== 1
            ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Проект:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectDropdown
                      multi={false}
                      value={this.state.projectId}
                      onChange={(option) => this.changeItem(option, 'projectId')}
                      placeholder="Введите название проекта"
                      options={[
                        {value: 1, label: 'Тестовый проект'},
                        {value: 0, label: 'Не выбрано'}
                      ]}
                    />
                  </Col>
                </Row>
              </label>
            : null
          }
          {
            this.state.taskId
            ? <label className={css.formField}>
                <Row>
                  <Col xs={12} sm={formLayout.left}>
                    Статус:
                  </Col>
                  <Col xs={12} sm={formLayout.right}>
                    <SelectDropdown
                      multi={false}
                      value={this.state.taskStatusId}
                      onChange={(option) => this.changeItem(option, 'taskStatusId')}
                      placeholder="Выбрать статус"
                      options={[
                        {
                          value: 2,
                          label: 'Develop'
                        },
                        {
                          value: 4,
                          label: 'Code Review'
                        },
                        {
                          value: 6,
                          label: 'QA'
                        }
                      ]}
                    />
                  </Col>
                </Row>
              </label>
            : null
          }
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
