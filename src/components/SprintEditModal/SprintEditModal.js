import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './SprintEditModal.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import moment from 'moment';

class SprintEditModal extends Component {
  static propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleEditSprint: PropTypes.func.isRequired,
    sprint: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);

    this.state = {
      sprint: {
        dateFrom: undefined,
        id: this.props.sprint.id,
        dateTo: undefined,
        sprintName: '',
        sprintTime: '',
        allottedTime: null,
        isHovered: false
      }
    };
  }

  onChangeTime = (e) => {
    const value = e.target.value;
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        allottedTime: value
      }
    }));
  };

  onChangeName = (e) => {
    const value = e.target.value;
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        sprintName: value
      }
    }));
  };

  handleDayFromChange = (date) => {
    const value = moment(date).format('YYYY-MM-DD');
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        dateFrom: value
      }
    }));
  };

  handleDayToChange = (date) => {
    const value = moment(date).format('YYYY-MM-DD');
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        dateTo: value
      }
    }));
  };

  handleEditSprint = () => {
    this.props.handleEditSprint(this.state.sprint);
  };

  render () {
    const { sprint } = this.props;
    let formattedDayFrom = '';
    let formattedDayTo = '';

    if (this.state.sprint.dateFrom) {
      formattedDayFrom = moment(this.state.sprint.dateFrom).format('DD.MM.YYYY');
    } else if (sprint.dateFrom) {
      moment(sprint.dateFrom).format('DD.MM.YYYY');
    }


    if (this.state.sprint.dateTo) {
      formattedDayTo = moment(this.state.sprint.dateTo).format('DD.MM.YYYY');
    } else if (sprint.dateTo) {
      moment(sprint.dateTo).format('DD.MM.YYYY');
    }

    return (
      <Modal
        isOpen
        contentLabel='modal'
        onRequestClose={this.props.handleCloseModal}>
        <div>
          <form className={css.editSprintForm}>
            <Row>
              <Col xs={12}>
                <h3>Редактирование спринта</h3>
                <Input
                  placeholder='Новое название спринта...'
                  defaultValue={sprint.name}
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6}>
                <DatepickerDropdown
                  name='dateFrom'
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder={moment(sprint.factStartDate).format('DD.MM.YYYY')}
                />
              </Col>
              <Col xs={12} sm={6}>
                <DatepickerDropdown
                  name='dateTo'
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder={moment(sprint.factFinishDate).format('DD.MM.YYYY')}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Input
                  placeholder='Введите новое значение времени...'
                  defaultValue={sprint.allottedTime || 0}
                  onChange={this.onChangeTime}
                />
              </Col>
            </Row>
            <Row className={css.createButton}
                 center='xs'>
              <Col xs>
                <Button type='green'
                        text='Изменить'
                        onClick={this.handleEditSprint}/>
              </Col>
            </Row>
          </form>
        </div>
      </Modal>
    );
  }
}


export default SprintEditModal;
