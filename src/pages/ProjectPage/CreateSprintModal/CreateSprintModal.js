import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import Input from '../../../components/Input';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './CreateSprintModal.scss';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSprint } from '../../../actions/Sprint';
import { getSprintsDateRange } from '../../../selectors/getSprintsDateRange';

class CreateSprintModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: undefined,
      dateTo: undefined,
      budget: 0,
      riskBudget: 0,
      sprintName: '',
      sprintTime: '',
      allottedTime: ''
    };
  }
  onChangeBudget = e => {
    this.setState({ budget: parseFloat(e.target.value) || 0 })
  }
  onChangeRiskBudget = e => {
    this.setState({ riskBudget: parseFloat(e.target.value) || 0 })
  }
  onChangeTime = e => {
    this.setState({ allottedTime: e.target.value });
  };

  onChangeName = e => {
    this.setState({ sprintName: e.target.value });
  };

  handleDayFromChange = date => {
    this.setState({ dateFrom: moment(date).format('YYYY-MM-DD') }, () => this.getDefaultTimeValue());
  };

  handleDayToChange = date => {
    this.setState({ dateTo: moment(date).format('YYYY-MM-DD') }, () => this.getDefaultTimeValue());

  };

  checkNullInputs = () => {
    return !!(this.state.sprintName && this.state.dateTo && this.state.dateFrom && this.state.allottedTime)
  }

  getDefaultTimeValue = () => {
    if (this.state.dateTo && this.state.dateFrom) {
      let calculatedHours = this.calcWorkingHours(this.state.dateFrom, this.state.dateTo)
      this.setState({ allottedTime: calculatedHours })
    }
  }

  calcWorkingHours(startDate, endDate) {
    let day = moment(startDate);
    let businessDays = 0;
    while (day.isSameOrBefore(endDate, 'day')) {
      if (day.day() != 0 && day.day() != 6) businessDays++;
      day.add(1, 'd');
    }
    return businessDays * 8;
  }

  validateDates = () => {
    // console.log(this.state.dateTo, this.state.dateFrom)
    // console.log(moment(this.state.dateTo).isAfter(this.state.dateFrom) )
    console.log(calcWorkingHours(this.state.dateFrom, this.state.dateTo))
    // console.log(this.state.dateTo)

  }

  createSprint = e => {
    e.preventDefault();
    this.props.onClose();
    this.props.createSprint(
      this.state.sprintName.trim(),
      this.props.projectId,
      this.state.dateFrom,
      this.state.dateTo,
      this.state.allottedTime,
      this.state.budget,
      this.state.riskBudget
    );
  };

  render() {
    const formattedDayFrom = this.state.dateFrom
      ? moment(this.state.dateFrom).format('DD.MM.YYYY')
      : '';
    const formattedDayTo = this.state.dateTo
      ? moment(this.state.dateTo).format('DD.MM.YYYY')
      : '';

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.props.onClose}>
        <div>
          <form className={css.createSprintForm}>
            <Row>
              <Col xs={12}>
                <h3 onClick={this.validateDates}>Создание нового спринта</h3>
                <hr />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Название спринта:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder="Название спринта"
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Дата начала:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="dateFrom"
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder="Дата начала"
                  disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Дата окончания:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="dateTo"
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder="Дата окончания"
                  disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Время в часах:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder="Время в часах"
                  onChange={this.onChangeTime}
                  value={this.state.allottedTime}
                  type='number'
                  min='0'
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol}  className={css.leftColumn}>
                <p>Бюджет без РР</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input  
                  type='number' 
                  min='0' 
                  placeholder="Бюджет без РР" 
                  onChange={this.onChangeBudget} 
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Бюджет с РР</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input 
                  type='number' 
                  min='0' 
                  placeholder="Бюджет с РР" 
                  onChange={this.onChangeRiskBudget} 
                />
              </Col>
            </Row>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text="Создать"
                  onClick={this.createSprint}
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

CreateSprintModal.propTypes = {
  createSprint: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  projectId: PropTypes.number,
  sprintsDateRanges: PropTypes.array
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  sprintsDateRanges: getSprintsDateRange(state.Project.project.sprints)
});

const mapDispatchToProps = {
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSprintModal);
