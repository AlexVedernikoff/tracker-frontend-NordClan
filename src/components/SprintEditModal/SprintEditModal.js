import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './SprintEditModal.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import DatepickerDropdown from '../../components/DatepickerDropdown';
import Input from '../../components/Input';
import moment from 'moment';
import localize from './SprintEditModal.json';
import { connect } from 'react-redux';
import parseInteger from '../../utils/parseInteger';
import validateNumber from '../../utils/validateNumber';
import * as commonUtils from '../../utils/common';

class SprintEditModal extends Component {
  static propTypes = {
    handleCloseModal: PropTypes.func.isRequired,
    handleEditSprint: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
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
        qaPercent: commonUtils.firstTruthyOrZero(props.sprint.qaPercent, props.project.qaPercent, '30'),
        isHovered: false,
        budget: this.props.sprint.budget || '0.00',
        riskBudget: this.props.sprint.riskBudget || '0.00'
      }
    };
  }

  componentDidMount = () => {
    const { sprint } = this.props;
    if (sprint.factStartDate) {
      this.handleDayFromChange(sprint.factStartDate);
    }

    if (sprint.factFinishDate) {
      this.handleDayToChange(sprint.factFinishDate);
    }
  };

  checkNullInputs = () => {
    return !!(
      this.state.sprint.sprintName.length &&
      this.state.sprint.budget.length &&
      this.state.sprint.riskBudget.length &&
      this.state.sprint.qaPercent !== ''
    );
  };

  onChangePercentQA = e => {
    const value = e.target.value;
    if (validateNumber(value) && value <= 100) {
      this.setState(state => ({
        sprint: {
          ...state.sprint,
          qaPercent: value === '' ? '' : parseInteger(value)
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
    if (validateNumber(value)) {
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
    if (validateNumber(value)) {
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
    return false;
  };

  validateAllFields = () => {
    return !this.checkNullInputs();
  };

  render() {
    const { sprint, lang } = this.props;
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
            <h3>{localize[lang].HEADER}</h3>
            <hr />
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? <span>{localize[lang].FILL}</span> : null}
                {this.state.sprint.dateTo && !this.validateDates() ? (
                  <span className={css.redMessage}>{localize[lang].DATE}</span>
                ) : null}
              </Col>
            </Row>
            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].SPRINT_NAME}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    placeholder={localize[lang].SPRINT_PLACEHOLDER}
                    value={this.state.sprint.sprintName}
                    onChange={this.onChangeName}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].START_DATE}</p>
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
                  <p>{localize[lang].END_DATE}</p>
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
                  <p>{localize[lang].QA_PERCENT}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    placeholder={localize[lang].QA_PERCENT_PLACEHOLDER}
                    value={this.state.sprint.qaPercent}
                    onChange={this.onChangePercentQA}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].WO_RISK}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    value={this.state.sprint.budget}
                    placeholder={localize[lang].WO_RISK_PLACEHOLDER}
                    onChange={this.onChangeBudget}
                  />
                </Col>
              </Row>
            </label>

            <label className={css.formField}>
              <Row>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].WITH_RISK}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Input
                    value={this.state.sprint.riskBudget}
                    placeholder={localize[lang].WITH_RISK_PLACEHOLDER}
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
                  text={localize[lang].CHANGE}
                  disabled={this.validateAllFields()}
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

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(SprintEditModal);
