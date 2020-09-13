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
import SelectDropdown from '../../../../components/SelectDropdown';
import localize from './CreateMilestoneModal.json';
import { getMilestoneTypes } from '../../../../selectors/dictionaries';

class CreateMilestoneModal extends Component {
  static propTypes = {
    createMilestone: PropTypes.func,
    lang: PropTypes.string,
    milestoneTypes: PropTypes.array,
    onClose: PropTypes.func,
    projectId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      date: undefined,
      name: '',
      typeId: 1,
      isValidDate: false
    };
  }

  onChangeName = e => {
    this.setState({ name: e.target.value });
  };

  handleDayChange = date => {
    this.setState({ date: date ? moment(date).format('YYYY-MM-DD') : '', isValidDate: true });
  };

  changeStatus = status => {
    if (status) {
      this.setState({ typeId: status.value });
    }
  };

  checkNullInputs = () => {
    return this.state.name.trim() && this.state.date && this.state.isValidDate && this.state.typeId;
  };

  dateInputHandler = e => {
    const inputValue = e.target.value;
    this.setState({ isValidDate: moment(inputValue, 'DD.MM.YYYY', true).isValid() });
  };

  createMilestone = e => {
    e.preventDefault();
    this.props.onClose();
    this.props.createMilestone(this.state.name.trim(), this.props.projectId, this.state.date, this.state.typeId);
  };

  onClear() {
    this.setState({ typeId: 1 });
  }

  render() {
    const formattedDay = this.state.date ? moment(this.state.date).format('DD.MM.YYYY') : '';

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };
    const { milestoneTypes, lang } = this.props;
    const options = milestoneTypes.map(type => ({
      value: type.id,
      label: localize[lang][type.codename]
    }));

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={this.props.onClose}>
        <div>
          <form className={css.createSprintForm}>
            <Row>
              <Col xs={12}>
                <h3>{localize[lang].CREATE_MILESTONE}</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? <span>{localize[lang].INPUT_NOTIFICATION}</span> : null}
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].MILESTONE_NAME}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input placeholder={localize[lang].ENTER_MILESTONE_NAME} onChange={this.onChangeName} />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].MILESTONE_TYPE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectDropdown
                  value={this.state.typeId}
                  options={options}
                  multi={false}
                  style={{ width: '100%' }}
                  className={css.selectEnum}
                  onChange={this.changeStatus}
                  placeholder={localize[lang].MILESTONE_TYPE}
                  noResultsText={localize[lang].NO_RESUTLS}
                  clearable={false}
                  onClear={() => this.onClear()}
                  canClear
                />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].DATE}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="date"
                  value={formattedDay}
                  onDayChange={this.handleDayChange}
                  onChange={this.dateInputHandler}
                  placeholder={localize[lang].ENTER_DATE}
                />
              </Col>
            </Row>
            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text={localize[lang].CREATE}
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
  projectId: state.Project.project.id,
  milestoneTypes: getMilestoneTypes(state) || [],
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  createMilestone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateMilestoneModal);
