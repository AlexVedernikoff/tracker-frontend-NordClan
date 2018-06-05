import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import Textarea from '../../../../components/TextArea';
import SelectDropdown from '../../../../components/SelectDropdown';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './EditSpentModal.scss';
import { connect } from 'react-redux';

class EditSpentModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    spentId: PropTypes.number,
    sprint: PropTypes.object,
    spentTime: PropTypes.string,
    typeId: PropTypes.number.isRequired,
    statusId: PropTypes.number.isRequired,
    comment: PropTypes.string,
    isBillible: PropTypes.bool,
    projectId: PropTypes.number.isRequired,
    projectSprints: PropTypes.array.isRequired
  };

  static validateNumbers(value) {
    const re = /^\d*(\.\d*)?$/;
    return value !== '' ? re.test(value) : true;
  }

  constructor(props) {
    super(props);

    this.state = {
      onClose: props.onClose,
      spentId: props.spentId || null,
      sprint: props.sprint || { id: null, name: 'Backlog' },
      spentTime: props.spentTime || 0,
      projectId: props.projectId,
      projectSprints: props.projectSprints,
      typeId: props.typeId,
      statusId: props.statusId,
      comment: props.comment || '',
      isBillible: props.isBillible || false
    };
  }

  checkNullInputs = () => {
    return !!(this.state.sprint && this.state.spentTime && this.state.comment);
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
    const { onClose, spentTime, sprint, projectSprints, comment } = this.state;

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
                {!this.checkNullInputs() ? <span>Все поля должны быть заполнены</span> : null}
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
            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Спринт:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectDropdown
                  className={css.select}
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
          </form>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  projectSprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(EditSpentModal);
