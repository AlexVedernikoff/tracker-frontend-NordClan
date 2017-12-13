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
    this.setState({ dateFrom: moment(date).format('YYYY-MM-DD') } );    
  };

  handleDayToChange = date => {
    this.setState({ dateTo: moment(date).format('YYYY-MM-DD') });
  };

  validateDates = () => {
    console.log(this.state.dateFrom)
    console.log(this.state.dateTo)
    
  }

  createSprint = e => {
    e.preventDefault();
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
              <hr/>
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
                  disabled={true}
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
