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

class CreateSprintModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      dateFrom: undefined,
      dateTo: undefined,
      sprintName: '',
      sprintTime: '',
      allottedTime: null
    };
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

  createSprint = () => {
    this.props.onClose();
    this.props.createSprint(
      this.state.sprintName.trim(),
      this.props.projectId,
      this.state.dateFrom,
      this.state.dateTo,
      this.state.allottedTime
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

const mapStateToProps = state => {
  const getSprintsDateRange = sprints => {
    const sprintsDates = [];
    const changeDays = (date, days, type) => {
      const result = new Date(date);
      if (type === 'increase') {
        result.setDate(result.getDate() + days);
      } else if (type === 'decrease') {
        result.setDate(result.getDate() - days);
      }
      return result;
    };

    for (const sprint of sprints) {
      const sprintDates = {
        after: changeDays(new Date(sprint.factStartDate), 1, 'decrease'),
        before: changeDays(new Date(sprint.factFinishDate), 1, 'increase')
      };
      sprintsDates.push(sprintDates);
    }
    return sprintsDates;
  };

  return {
    projectId: state.Project.project.id,
    sprintsDateRanges: getSprintsDateRange(state.Project.project.sprints)
  };
};

const mapDispatchToProps = {
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSprintModal);
