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
import localize from './CreateSprintModal.json';
import parseInteger from '../../../utils/parseInteger';

class CreateSprintModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: undefined,
      dateTo: undefined,
      budget: '',
      riskBudget: '',
      sprintName: '',
      allottedTimeQa: props.project.qaPercent || 30
    };
  }

  onChangeBudget = e => {
    if (this.validateNumbers(e.target.value)) {
      this.setState({ budget: e.target.value });
    }
  };

  onChangeRiskBudget = e => {
    if (this.validateNumbers(e.target.value)) {
      this.setState({ riskBudget: e.target.value });
    }
  };

  onChangeTimeQA = e => {
    if (this.validateNumbers(e.target.value) && e.target.value <= 100) {
      this.setState({ allottedTimeQa: e.target.value === '' ? '' : parseInteger(e.target.value) });
    }
  };

  onChangeName = e => {
    this.setState({ sprintName: e.target.value.trim() });
  };

  handleDayFromChange = date => {
    this.setState({ dateFrom: moment(date).format('YYYY-MM-DD') });
  };

  handleDayToChange = date => {
    this.setState({ dateTo: moment(date).format('YYYY-MM-DD') });
  };

  checkNullInputs = () => {
    return !!(
      this.state.sprintName &&
      this.state.dateTo &&
      this.state.dateFrom &&
      this.state.budget &&
      this.state.riskBudget &&
      this.state.allottedTimeQa
    );
  };

  setDefaultTimeValue = () => {
    if (this.state.dateTo && this.state.dateFrom) {
      const calculatedHours = this.calcWorkingHours(this.state.dateFrom, this.state.dateTo);
      this.setState({ budget: calculatedHours });
    }
  };

  calcWorkingHours(startDate, endDate) {
    const day = moment(startDate);
    let businessDays = 0;
    while (day.isSameOrBefore(endDate, 'day')) {
      if (day.day() !== 0 && day.day() !== 6) businessDays++;
      day.add(1, 'd');
    }
    return businessDays * 8;
  }

  validateNumbers(value) {
    const re = /^\d*(\.\d*)?$/;
    return value !== '' ? re.test(value) : true;
  }

  validateDates = () => {
    if (this.state.dateTo && this.state.dateFrom) {
      return moment(this.state.dateTo).isSameOrAfter(this.state.dateFrom);
    }
    return true;
  };

  createSprint = e => {
    e.preventDefault();
    this.props.onClose();
    this.props.createSprint(
      this.state.sprintName.trim(),
      this.props.projectId,
      this.state.dateFrom,
      this.state.dateTo,
      Number(this.state.allottedTimeQa),
      Number(this.state.budget),
      Number(this.state.riskBudget)
    );
  };

  render() {
    const { lang } = this.props;
    const formattedDayFrom = this.state.dateFrom ? moment(this.state.dateFrom).format('DD.MM.YYYY') : '';
    const formattedDayTo = this.state.dateTo ? moment(this.state.dateTo).format('DD.MM.YYYY') : '';

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
                <h3>{localize[lang].NEW_SPRINT}</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? <span>{localize[lang].INPUT_NOTIFICATION}</span> : null}
                {!this.validateDates() ? (
                  <span className={css.redMessage}>{localize[lang].DATE_NOTIFICATION}</span>
                ) : null}
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].SPRINT_NAME}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input placeholder={localize[lang].ENTER_SPRINT_NAME} onChange={this.onChangeName} />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].DATE_OF_START}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="dateFrom"
                  value={formattedDayFrom}
                  onDayChange={this.handleDayFromChange}
                  placeholder={localize[lang].ENTER_START_DATE}
                  // disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].DATE_OF_ENDING}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="dateTo"
                  value={formattedDayTo}
                  onDayChange={this.handleDayToChange}
                  placeholder={localize[lang].ENTER_END_DATE}
                  //disabledDataRanges={this.props.sprintsDateRanges}
                />
              </Col>
            </Row>

            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].QA_PERCENT}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder={localize[lang].ENTER_QA_PERCENT}
                  onChange={this.onChangeTimeQA}
                  value={this.state.allottedTimeQa}
                />
              </Col>
            </Row>

            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].WO_RISK_RESERVE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder={localize[lang].ENTER_BUDGET_WO_RISK_RESERVE}
                  onChange={this.onChangeBudget}
                  value={this.state.budget}
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].WITH_RISK_RESERVE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder={localize[lang].ENTER_BUDGET_WITH_RISK_RESERVE}
                  onChange={this.onChangeRiskBudget}
                  value={this.state.riskBudget}
                />
              </Col>
            </Row>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text={localize[lang].CREATE}
                  onClick={this.createSprint}
                  disabled={!this.checkNullInputs() || !this.validateDates()}
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
  project: PropTypes.object.isRequired,
  projectId: PropTypes.number,
  sprintsDateRanges: PropTypes.array
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  sprintsDateRanges: getSprintsDateRange(state.Project.project.sprints),
  lang: state.Localize.lang,
  project: state.Project.project
});

const mapDispatchToProps = {
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSprintModal);
