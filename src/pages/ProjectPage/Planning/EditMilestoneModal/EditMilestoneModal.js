import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './EditMilestoneModal.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../../../../components/Button';
import Modal from '../../../../components/Modal';
import Checkbox from '../../../../components/Checkbox/Checkbox';
import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import Input from '../../../../components/Input';
import moment from 'moment';
import { connect } from 'react-redux';
import { editMilestone } from '../../../../actions/Milestone';

class EditMilestoneModal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      milestone: {
        id: this.props.milestone.id,
        name: this.props.milestone.name,
        date: this.props.milestone.date,
        done: this.props.milestone.done
      }
    };
  }

  onChangeName = e => {
    const value = e.target.value;
    this.setState(state => ({
      milestone: {
        ...state.milestone,
        name: value
      }
    }));
  };

  handleDayChange = date => {
    const value = moment(date).format('YYYY-MM-DD');
    this.setState(state => ({
      milestone: {
        ...state.milestone,
        date: value
      }
    }));
  };

  handleStatusChange = e => {
    e.persist();
    this.setState(state => ({
      milestone: {
        ...state.milestone,
        done: e.target.checked
      }
    }));
  };

  handleEditMilestone = (e) => {
    e.preventDefault();
    this.props.onClose();
    this.props.editMilestone(this.state.milestone);
  };

  render () {
    const formattedDay = this.state.milestone.dateFrom
      ? moment(this.state.milestone.dateFrom).format( 'DD.MM.YYYY')
      : ''

    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };

    return (
      <Modal
        isOpen
        contentLabel="modal"
        onRequestClose={this.props.onClose}
      >
        <div>
          <form className={css.createSprintForm}>
            <Row className={css.inputRow}>
              <Col xs={12}>
                <h3>Редактирование вехи</h3>
                <hr />
              </Col>
            </Row>
            <Row className={css.inputRow}>
              <Col
                xs={12}
                sm={formLayout.firstCol}
                className={css.leftColumn}
              >
                <p>Название вехи:</p>
              </Col>
              <Col
                xs={12}
                sm={formLayout.secondCol}
                className={css.rightColumn}
              >
                <Input
                  placeholder="Введите название вехи"
                  defaultValue={this.state.milestone.name}
                  onChange={this.onChangeName}
                />
              </Col>
            </Row>

            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Дата:</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <DatepickerDropdown
                  name="date"
                  value={formattedDay}
                  onDayChange={this.handleDayChange}
                  placeholder={moment(this.state.milestone.date).format('DD.MM.YYYY')}
                />
              </Col>
            </Row>

            <Row className={css.inputRow}>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Выполнено</p>
              </Col>
              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <Checkbox
                  checked={this.state.milestone.done}
                  onChange={this.handleStatusChange}
                />
              </Col>
            </Row>

            <Row className={css.createButton} center="xs">
              <Col xs>
                <Button
                  type="green"
                  htmlType="submit"
                  text="Изменить"
                  onClick={this.handleEditMilestone}
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
});

const mapDispatchToProps = {
  editMilestone
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMilestoneModal);
