import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateMilestoneModal.scss';
import moment from 'moment';
import { connect } from 'react-redux';
import { createMilestone } from '../../../../actions/Milestone';
import Select from 'react-select';

const options = [
  {
    label: 'Получение отзыва',
    value: 1
  },
  {
    label: 'Демо Клиенту',
    value: 2
  },
  {
    label: 'Внутренняя демо',
    value: 3
  },
  {
    label: 'Другое',
    value: 4
  }
];

class CreateMilestoneModal extends Component {
  static propTypes = {
    createMilestone: PropTypes.func,
    onClose: PropTypes.func,
    projectId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      date: undefined,
      name: '',
      enum: 1
    };
  }

  onChangeName = e => {
    this.setState({ name: e.target.value });
  };

  handleDayChange = date => {
    this.setState({ date: date ? moment(date).format('YYYY-MM-DD') : '' });
  };

  changeStatus = status => {
    this.setState({ enum: status.value });
  };

  checkNullInputs = () => {
    return this.state.name.trim() && this.state.date;
  };

  dateInputHandler = e => {
    const inputValue = e.target.value;
    const isValidValue = moment(inputValue, 'DD.MM.YYYY', true).isValid();
    if (!isValidValue && this.state.date) {
      this.setState({ date: '' });
    }
  };

  createMilestone = e => {
    e.preventDefault();
    this.props.onClose();
    this.props.createMilestone(this.state.name.trim(), this.props.projectId, this.state.date);
  };

  render() {
    const formattedDay = this.state.date ? moment(this.state.date).format('DD.MM.YYYY') : '';

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.props.onClose}>
        <div>
          <form className={css.createSprintForm}>
            <Row>
              <Col xs={12}>
                <h3>Создание новой вехи</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? <span>Все поля должны быть заполнены</span> : null}
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Название вехи:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input placeholder="Введите название вехи" onChange={this.onChangeName} />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Типы майлстоунов:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Select
                  value={this.state.enum}
                  options={options}
                  multi={false}
                  style={{ width: '100%' }}
                  className={css.selectEnum}
                  onChange={this.changeStatus}
                  placeholder="Типы майлстоунов"
                  noResultsText="Нет результатов"
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Дата:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="date"
                  value={formattedDay}
                  onDayChange={this.handleDayChange}
                  onChange={this.dateInputHandler}
                  placeholder="Введите дату"
                />
              </Col>
            </Row>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text="Создать"
                  onClick={this.createMilestone}
                  disabled={!this.checkNullInputs()}
                />
              </Col>
            </Row>
          </form>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  projectId: state.Project.project.id
});

const mapDispatchToProps = {
  createMilestone
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMilestoneModal);
