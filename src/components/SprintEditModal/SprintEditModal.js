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
    this.setState({
      sprint: {
        ...this.state.sprint,
        allottedTime: e.target.value
      }
    });
  };

  onChangeName = (e) => {
    this.setState({
      sprint: {
        ...this.state.sprint,
        sprintName: e.target.value
      }
    });
  };

  handleDayFromChange = (date) => {
    this.setState({
      sprint: {
        ...this.state.sprint,
        dateFrom: moment(date).format('YYYY-MM-DD')
      }
    });
  };

  handleDayToChange = (date) => {
    this.setState({
      sprint: {
        ...this.state.sprint,
        dateTo: moment(date).format('YYYY-MM-DD')
      }
    });
  };

  handleEditSprint = () => {
    this.props.handleEditSprint(this.state.sprint);
  };

  render () {
    const { sprint } = this.props;

    const formattedDayFrom = this.state.sprint.dateFrom ? moment(this.state.sprint.dateFrom).format('DD.MM.YYYY') :
      sprint.dateFrom ? moment(sprint.dateFrom).format('DD.MM.YYYY') : '';

    const formattedDayTo = this.state.sprint.dateTo ? moment(this.state.sprint.dateTo).format('DD.MM.YYYY') :
      sprint.dateTo ? moment(sprint.dateTo).format('DD.MM.YYYY') : '';

    return (
      <Modal
        isOpen
        contentLabel='modal'
        onRequestClose={this.props.handleCloseModal}>
        <div>
          <div>
            <Row>
              <Col xsOffset={1}
                   xs={10}>
                <h3>Редактирование спринта</h3>
                <Input
                  placeholder='Новое название спринта...'
                  defaultValue={sprint.name}
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>
            <Row>
              <Col xsOffset={1} xs={5}>
                <DatepickerDropdown
                  name='dateFrom'
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder={moment(sprint.factStartDate).format('DD.MM.YYYY')}
                />
              </Col>
              <Col xs={5}>
                <DatepickerDropdown
                  name='dateTo'
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder={moment(sprint.factFinishDate).format('DD.MM.YYYY')}
                />
              </Col>
            </Row>
            <Row>
              <Col xsOffset={1}
                   xs={10}>
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
          </div>
        </div>
      </Modal>
    );
  }
}

SprintEditModal.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleEditSprint: PropTypes.func.isRequired,
  sprint: PropTypes.object.isRequired
};


export default SprintEditModal;
