import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './EditSpentModal.scss';
import localize from './EditSpentModal.json';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Input from '../../Input';
import SelectDropdown from '../../SelectDropdown/SelectDropdown';
import Modal from '../../Modal';
import TextareaAutosize from 'react-autosize-textarea';

class EditSpentModal extends Component {
  static propTypes = {
    comment: PropTypes.string,
    isBillable: PropTypes.bool,
    isMagic: PropTypes.bool,
    lang: PropTypes.string,
    magicActivitiesTypes: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    projectId: PropTypes.number,
    projectSprints: PropTypes.array.isRequired,
    spentId: PropTypes.number,
    spentTime: PropTypes.string,
    sprint: PropTypes.object,
    statuses: PropTypes.array,
    taskStatusId: PropTypes.number,
    timesheet: PropTypes.object.isRequired,
    typeId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      spentId: props.spentId || null,
      sprint: props.sprint || { id: null, name: 'Backlog' },
      spentTime: props.spentTime || 0,
      comment: props.comment || '',
      isBillable: props.isBillable || false
    };
  }

  changeBillable = ({ target: { checked } }) => this.setState({ isBillable: checked });

  validateNumbers(value) {
    const re = /^\d*(\.\d*)?$/;
    return value !== '' ? re.test(value) : true;
  }

  checkNullInputs = () => {
    return !!this.state.spentTime;
  };

  onChangeSpentTime = e => {
    const hoursPerDay = 24;
    const spentTime = e.target.value < hoursPerDay ? e.target.value : hoursPerDay;
    if (this.validateNumbers(e.target.value)) {
      this.setState({ spentTime: spentTime });
    }
  };

  changeSprint = sprint => {
    if (sprint) {
      this.setState({ sprint: { id: sprint.value, name: sprint.label } });
    } else {
      this.setState({ sprint: null });
    }
  };

  onChangeComment = e => {
    this.setState({ comment: e.target.value });
  };

  render() {
    const { spentTime, sprint, comment, isBillable } = this.state;
    const {
      projectSprints,
      statuses,
      typeId,
      taskStatusId,
      magicActivitiesTypes,
      onClose,
      isMagic,
      onSave,
      timesheet,
      lang
    } = this.props;
    const status = taskStatusId ? statuses.find(el => el.id === taskStatusId).name : '';
    const activityType = typeId ? magicActivitiesTypes.find(el => el.id === typeId).name : '';

    const projectSprintsOptions = projectSprints.map(el => {
      return { value: el.id, label: el.name };
    });

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    return (
      <Modal isOpen contentLabel="modal" onRequestClose={onClose}>
        <div>
          <form className={css.editSpentForm}>
            <Row>
              <Col xs={12}>
                <h3>{localize[lang].EDITING}</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? (
                  <span className={css.redMessage}>{localize[lang].ALL_FIELDS_MUST_BE_FILLED}</span>
                ) : null}
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>{localize[lang].TIME_SPANT}</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input
                  placeholder={localize[lang].ENTER_SPANT_TIME}
                  onChange={this.onChangeSpentTime}
                  value={spentTime}
                />
              </Col>
            </Row>
            {!isMagic ? (
              <div>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>{localize[lang].SPRINT}</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <SelectDropdown
                      className={css.fullwidth}
                      onChange={this.changeSprint}
                      value={sprint ? sprint.id : null}
                      placeholder={localize[lang].SHOOSE_SPRINT}
                      options={projectSprintsOptions}
                    />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>{localize[lang].COMMENT}</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <TextareaAutosize
                      onChange={this.onChangeComment}
                      placeholder={localize[lang].ENTER_COMMENT}
                      value={comment}
                    />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>{localize[lang].ACTIVITY_TYPE}</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <Input disabled value={activityType} />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>{localize[lang].STATUS}</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <Input disabled value={status} />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>Billable:</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <Checkbox checked={isBillable} onChange={this.changeBillable} />
                  </Col>
                </Row>
              </div>
            ) : null}
            <div className={css.buttonWrap}>
              <Button
                onClick={onSave.bind(this, this.state, timesheet)}
                text={localize[lang].SAVE}
                type="green"
                icon="IconCheck"
              />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

export default EditSpentModal;
