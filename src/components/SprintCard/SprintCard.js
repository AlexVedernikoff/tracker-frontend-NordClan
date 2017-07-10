import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { deleteSprint } from '../../actions/Sprint';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import moment from 'moment';

import { IconPlay, IconPause, IconClose } from '../Icons';
import * as css from './SprintCard.scss';


class SprintCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isModalOpen: false,
      dateFrom: undefined,
      dateTo: undefined,
      sprintName: '',
      sprintTime: ''
    };
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  editSprint = () => {
    console.log('edit');
  };

  render () {
    const { sprint, deleteSprint, ...other } = this.props;

    const formattedDayFrom = this.state.dateFrom
      ? moment(this.state.dateFrom).format('DD.MM.YYYY')
      : '';
    const formattedDayTo = this.state.dateTo
      ? moment(this.state.dateTo).format('DD.MM.YYYY')
      : '';
    return (
      <div
        className={classnames([css.sprintCard], [css[sprint.status]])}
        {...other}
      >
        <IconClose
          className={css.iconClose}
          onClick={() => {deleteSprint(sprint.id);}}
        />
        <p className={css.sprintTitle}
           onClick={this.handleOpenModal}>
          {sprint.name}
        </p>
        <p className={css.sprintMeta}>
          <span>Дата начала:</span>
        <span>
          {moment(sprint.factStartDate).format('DD.MM.YYYY')}
        </span>
        </p>
        {sprint.factFinishDate
          ? <p className={css.sprintMeta}>
          <span>Дата окончания:</span>
            <span>
              {moment(sprint.factFinishDate).format('DD.MM.YYYY')}
            </span>
        </p>
          : null}

        <p className={css.sprintMeta}>
          <span>Всего задач:</span>
        <span>
          {sprint.tasksTotal || 0}
        </span>
        </p>
        <p className={css.sprintMeta}>
          <span>Выполнено:</span>
        <span>
          {sprint.tasksDone || 0}
        </span>
        </p>
        <div
          className={classnames({
            [css.status]: true,
            [css.inprogress]: sprint.statusId === 2,
            [css.inhold]: sprint.statusId === 1
          })}
          data-tip={sprint.statusId === 2 ? 'Остановить' : 'Запустить'}
        >
          {sprint.status === 'INPROGRESS' ? <IconPause /> : <IconPlay />}
        </div>
        {
          this.state.isModalOpen
            ? <Modal
            isOpen
            contentLabel="modal"
            onRequestClose={this.handleCloseModal}>
            <div>
              <div>
                <Row>
                  <Col xsOffset={1}
                       xs={10}>
                    <h3>Редактирование спринта</h3>
                    <Input
                      placeholder="Введите название спринта..."
                      onChange={this.onChangeName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <DatepickerDropdown
                      name="dateFrom"
                      value={formattedDayFrom}
                      onDayChange={this.handleDayFromChange}
                      placeholder="Дата начала"
                    />
                    <DatepickerDropdown
                      name="dateTo"
                      value={formattedDayTo}
                      onDayChange={this.handleDayToChange}
                      placeholder="Дата окончания"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xsOffset={1}
                       xs={10}>
                    <Input
                      placeholder="Введите время в часах..."
                      onChange={this.onChangeTime}
                    />
                  </Col>
                </Row>
                <Row className={css.createButton}
                     center="xs">
                  <Col xs>
                    <Button type="green"
                            text="Создать"
                            onClick={this.editSprint}/>
                  </Col>
                </Row>
              </div>
            </div>
          </Modal>
            : null
        }
      </div>
    );
  }
}

SprintCard.propTypes = {
  deleteSprint: PropTypes.func.isRequired,
  sprint: PropTypes.object
};

SprintCard.defaultProps = {
  sprint: {
    name: 'Название спринта',
    dateStart: '00.00.00',
    dateEnd: '00.00.00',
    tasksTotal: '00',
    tasksDone: '00',
    status: 'INPROGRESS'
  }
};

const mapDispatchToProps = {
  deleteSprint
};

export default connect(null, mapDispatchToProps)(SprintCard);
