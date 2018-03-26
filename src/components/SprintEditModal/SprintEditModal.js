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

  constructor(props) {
    super(props);

    this.state = {
      sprint: {
        dateFrom: undefined,
        id: this.props.sprint.id,
        dateTo: undefined,
        sprintName: this.props.sprint.name,
        allottedTime: this.props.sprint.allottedTime || '0.00',
        isHovered: false,
        budget: this.props.sprint.budget || '0.00',
        riskBudget: this.props.sprint.riskBudget || '0.00'
      }
    };
  }

  checkNullInputs = () => {
    return !!(
      this.state.sprint.sprintName.length &&
      this.state.sprint.allottedTime.length &&
      this.state.sprint.budget.length &&
      this.state.sprint.riskBudget.length
    );
  };
  validateNumbers(value) {
    const re = /^\d*(\.\d*)?$/;
    return value !== '' ? re.test(value) : true;
  }
  onChangeTime = e => {
    const value = e.target.value;
    if (this.validateNumbers(value)) {
      this.setState(state => ({
        sprint: {
          ...state.sprint,
          allottedTime: value
        }
      }));
    }
  };

  onChangeName = e => {
    const value = e.target.value;
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        sprintName: value
      }
    }));
  };

  onChangeBudget = e => {
    const value = e.target.value;
    if (this.validateNumbers(value)) {
      this.setState(state => ({
        sprint: {
          ...state.sprint,
          budget: value
        }
      }));
    }
  };

  onChangeRiskBudget = e => {
    const value = e.target.value;
    if (this.validateNumbers(value)) {
      this.setState(state => ({
        sprint: {
          ...state.sprint,
          riskBudget: value
        }
      }));
    }
  };

  handleDayFromChange = date => {
    const value = moment(date).format('YYYY-MM-DD');
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        dateFrom: value
      }
    }));
  };

  handleDayToChange = date => {
    const value = moment(date).format('YYYY-MM-DD');
    this.setState(state => ({
      sprint: {
        ...state.sprint,
        dateTo: value
      }
    }));
  };

  handleEditSprint = e => {
    e.preventDefault();
    this.props.handleEditSprint(this.state.sprint);
  };

  validateDates = () => {
    if (this.state.sprint.dateFrom && this.state.sprint.dateTo) {
      return moment(this.state.sprint.dateTo).isAfter(this.state.sprint.dateFrom);
    }
    if (!this.state.sprint.dateFrom && this.state.sprint.dateTo) {
      return moment(this.state.sprint.dateTo).isAfter(this.props.sprint.factStartDate);
    }
    if (this.state.sprint.dateFrom && !this.state.sprint.dateTo) {
      return moment(this.props.sprint.factFinishDate).isAfter(this.state.sprint.dateFrom);
    }
    return true;
  };

  render() {
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
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.props.handleCloseModal}>
        <div>
          <form className={css.editSprintForm}>
            <h3>Редактирование спринта</h3>
            <hr />
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? <span>Все поля должны быть заполнены</span> : null}
                {!this.validateDates() ? (
                  <span className={css.redMessage}>Дата окончания должна быть позже даты начала</span>
                ) : null}
              </Col>
            </Row>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Название спринта:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    placeholder="Введите название спринта"
                    value={this.state.sprint.sprintName}
                    onChange={this.onChangeName}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Дата начала:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <DatepickerDropdown
                    name="dateFrom"
                    value={formattedDayFrom}
                    onDayChange={this.handleDayFromChange}
                    placeholder={moment(sprint.factStartDate).format('DD.MM.YYYY')}
                  />
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Дата окончания:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <DatepickerDropdown
                    name="dateTo"
                    value={formattedDayTo}
                    onDayChange={this.handleDayToChange}
                    placeholder={moment(sprint.factFinishDate).format('DD.MM.YYYY')}
                  />
                </Col>
              </Row>
            </label>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Выделенное время:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    placeholder="Введите новое значение времени..."
                    value={this.state.sprint.allottedTime}
                    onChange={this.onChangeTime}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Бюджет без рискового резерва:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    value={this.state.sprint.budget}
                    placeholder="Введите новое значение бюджета без РР"
                    onChange={this.onChangeBudget}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>Бюджет с рисковым резервом:</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    value={this.state.sprint.riskBudget}
                    placeholder="Введите новое значение бюджета с РР"
                    onChange={this.onChangeRiskBudget}
                  />
                </Col>
              </Row>
            </label>

            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text="Изменить"
                  disabled={!this.checkNullInputs() || !this.validateDates()}
                  onClick={this.handleEditSprint}
                />
              </Col>
            </Row>
          </form>
        </div>
      </Modal>
    );
  }
}

export default SprintEditModal;
