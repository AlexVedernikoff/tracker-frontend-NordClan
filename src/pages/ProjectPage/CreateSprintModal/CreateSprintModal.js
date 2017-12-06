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
  constructor (props) {
    super(props);

    this.state = {
      dateFrom: undefined,
      dateTo: undefined,
      budget: 0,
      riskBudget: 0,
      sprintName: '',
      sprintTime: '',
      allottedTime: null
    };
  }
  onChangeBudget = e => {
    this.setState({ budget: parseFloat(e.target.value)})
  }
  onChangeRiskBudget = e => {
    this.setState({ riskBudget: parseFloat(e.target.value)})
  }
  onChangeTime = e => {
    this.setState({ allottedTime: e.target.value });
  };

  onChangeName = e => {
    this.setState({ sprintName: e.target.value });
  };

  handleDayFromChange = date => {
    this.setState({ dateFrom: moment(date).format('YYYY-MM-DD') });
  };

  handleDayToChange = date => {
    this.setState({ dateTo: moment(date).format('YYYY-MM-DD') });
  };

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

  render () {
    const formattedDayFrom = this.state.dateFrom
      ? moment(this.state.dateFrom).format('DD.MM.YYYY')
      : '';
    const formattedDayTo = this.state.dateTo
      ? moment(this.state.dateTo).format('DD.MM.YYYY')
      : '';

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.props.onClose}>
        <div>
          <form className={css.createSprintForm}>
            <Row>
              <Col xs={12}>
                <h3>Создание нового спринта</h3>
                <Input
                  placeholder="Введите название спринта..."
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6}>
                <DatepickerDropdown
                  name="dateFrom"
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder="Дата начала"
                  disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
              <Col xs={12} sm={6}>
                <DatepickerDropdown
                  name="dateTo"
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder="Дата окончания"
                  disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6}>
                <Input placeholder="Бюджет без РР" onChange={this.onChangeBudget}/>
              </Col>
              <Col xs={12} sm={6}>
                <Input placeholder="Бюджет с РР" onChange={this.onChangeRiskBudget}/>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Input
                  placeholder="Введите время в часах..."
                  onChange={this.onChangeTime}
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
