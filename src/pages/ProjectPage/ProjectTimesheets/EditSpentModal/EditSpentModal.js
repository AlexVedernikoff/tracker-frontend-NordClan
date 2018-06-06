import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/TextArea';
import Checkbox from '../../../../components/Checkbox';
import SelectDropdown from '../../../../components/SelectDropdown';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './EditSpentModal.scss';
import { connect } from 'react-redux';

class EditSpentModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    spentId: PropTypes.number,
    sprint: PropTypes.object,
    spentTime: PropTypes.string,
    typeId: PropTypes.number,
    taskStatusId: PropTypes.number,
    comment: PropTypes.string,
    isBillible: PropTypes.bool,
    projectId: PropTypes.number.isRequired,
    projectSprints: PropTypes.array.isRequired,
    statuses: PropTypes.array,
    taskTypes: PropTypes.array,
    isMagic: PropTypes.bool,
    timesheet: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      spentId: props.spentId || null,
      sprint: props.sprint || { id: null, name: 'Backlog' },
      spentTime: props.spentTime || 0,
      comment: props.comment || ''
    };
  }

  validateNumbers(value) {
    const re = /^\d*(\.\d*)?$/;
    return value !== '' ? re.test(value) : true;
  }

  checkNullInputs = () => {
    return !!this.state.spentTime;
  };

  onChangeSpentTime = e => {
    if (this.validateNumbers(e.target.value)) {
      this.setState({ spentTime: e.target.value });
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
    const { spentTime, sprint, comment } = this.state;
    const {
      projectSprints,
      statuses,
      typeId,
      taskStatusId,
      taskTypes,
      onClose,
      isBillible,
      isMagic,
      onSave,
      timesheet
    } = this.props;
    const status = taskStatusId ? statuses.find(el => el.id === taskStatusId).name : '';
    const taskType = typeId ? taskTypes.find(el => el.id === typeId).name : '';

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
                <h3>Редактирование</h3>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={css.validateMessages}>
                {!this.checkNullInputs() ? (
                  <span className={css.redMessage}>Все поля должны быть заполнены</span>
                ) : null}
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Потрачено времени:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Input placeholder="Введите потраченное время" onChange={this.onChangeSpentTime} value={spentTime} />
              </Col>
            </Row>
            {!isMagic ? (
              <div>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>Спринт:</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <SelectDropdown
                      className={css.fullwidth}
                      onChange={this.changeSprint}
                      value={sprint ? sprint.id : null}
                      placeholder={'Выберите спринт'}
                      options={projectSprintsOptions}
                    />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>Комментарий:</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <Textarea onChange={this.onChangeComment} placeholder="Введите комментарий" value={comment} />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>Тип активности:</p>
                  </Col>
                  <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                    <Input disabled value={taskType} />
                  </Col>
                </Row>
                <Row className={css.inputRow}>
                  <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                    <p>Статус:</p>
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
                    <Checkbox disabled checked={isBillible} />
                  </Col>
                </Row>
              </div>
            ) : null}
            <div className={css.buttonWrap}>
              <Button
                onClick={onSave.bind(this, this.state, timesheet)}
                text="Сохранить"
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

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes,
  projectId: state.Project.project.id,
  projectSprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(EditSpentModal);
