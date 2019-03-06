import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Modal from '../../../../components/Modal';
import ValidatedInput from '../../../../components/ValidatedInput';
import Validator from '../../../../components/ValidatedInput/Validator';
import Checkbox from '../../../../components/Checkbox';
import Button from '../../../../components/Button';
import Loader from '../../../../pages/InnerContainer/AppHead/Loader';
import localize from '../Sprint/Sprint.json';
import * as css from '../Task/CreateMilestoneModal/CreateMilestoneModal.scss';

const formLayout = {
  firstCol: 4,
  secondCol: 8
};

const initState = {
  forms: {
    sprintId: null,
    name: '',
    description: '',
    visible: true,
    plannedExecutionTime: ''
  },
  errors: {
    name: false,
    description: false,
    plannedExecutionTime: false
  }
};

class AddGoal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    create: PropTypes.func,
    edit: PropTypes.func,
    errorCreateGoal: PropTypes.array,
    goalItem: PropTypes.object,
    isEdit: PropTypes.bool,
    isFetching: PropTypes.bool,
    isSuccess: PropTypes.bool,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    lang: PropTypes.string,
    showModal: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      forms: initState.forms,
      errors: initState.errors,
      isClose: false,
      isError: false
    };

    this.validator = new Validator();
  }

  componentWillReceiveProps(nextProps) {
    const { isFetching, isSuccess, isEdit, goalItem } = nextProps;
    if (isEdit) {
      this.setState({
        forms: {
          name: goalItem.name,
          description: goalItem.description,
          visible: goalItem.visible,
          plannedExecutionTime: moment.unix(goalItem.plannedExecutionTime * 100).format('DD.MM.YYYY')
        }
      });
    } else {
      this.setState({ forms: initState.forms });
    }
    if (!isFetching && isSuccess && !this.state.isClose) {
      this.setState(
        {
          forms: initState.forms,
          isClose: true
        },
        this.props.closeModal
      );
    }
  }

  handleChangeGoalForms = name => ({ target: { value } }) =>
    this.setState({
      forms: {
        ...this.state.forms,
        [name]: value
      },
      errors: {
        ...this.state.errors,
        [name]: false
      }
    });

  validationCreateGoal = cb => {
    const {
      forms: { name, description, plannedExecutionTime }
    } = this.state;
    this.setState(
      {
        errors: {
          ...this.state.errors,
          ...{
            name: name.length < 2,
            description: description.length < 2,
            plannedExecutionTime: !plannedExecutionTime
          }
        }
      },
      () => {
        const { errors } = this.state;
        let isError = false;
        for (const key in errors) {
          if (errors[key]) {
            isError = true;
            break;
          }
        }
        this.setState({ isError }, cb);
      }
    );
  };

  handleAddGoal = sprintId => () =>
    this.validationCreateGoal(() => {
      if (this.state.isError) return;
      const { forms } = this.state;
      const {
        isEdit,
        edit,
        create,
        item: { projectId }
      } = this.props;
      const plannedExecutionTime = +moment(forms.plannedExecutionTime, 'DD.MM.YYYY').format('X') / 100;
      const data = {
        ...forms,
        sprintId,
        projectId,
        plannedExecutionTime
      };
      this.props.closeModal();
      return isEdit ? edit(data) : create(data);
    });

  render() {
    const {
      forms: { name, visible, plannedExecutionTime, description },
      errors
    } = this.state;
    const { showModal, lang, item, closeModal, isFetching, errorCreateGoal, isEdit, goalItem } = this.props;
    return (
      <div>
        <Modal isOpen={showModal} onRequestClose={closeModal} contentLabel="modal">
          <div>
            <form className={css.createSprintForm}>
              <Row className={css.inputRow}>
                <Col xs={12}>
                  <h3>{localize[lang].ADD_GOAL}</h3>
                  <hr />
                </Col>
              </Row>

              <Row className={css.inputRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].INPUT_GOAL}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        placeholder={localize[lang].ENTER_GOAL_NAME}
                        onChange={this.handleChangeGoalForms('name')}
                        value={name}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={errorCreateGoal.name || localize[lang].ENTER_GOAL_NAME}
                      />
                    ),
                    'name',
                    errors.name
                  )}
                </Col>
              </Row>

              <Row className={css.inputRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].DESCRIPTION_GOAL}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        elementType="textarea"
                        placeholder={localize[lang].ENTER_DESCRIPTION_GOAL}
                        onChange={this.handleChangeGoalForms('description')}
                        value={description}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        errorText={errorCreateGoal.description || localize[lang].ENTER_DESCRIPTION_GOAL}
                      />
                    ),
                    'description',
                    errors.description
                  )}
                </Col>
              </Row>
              <Row className={css.inputRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].IS_VISIBLE}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <Checkbox onChange={() => this.handleChangeGoalForms('visible')({ target: { value: !visible } })} />
                </Col>
              </Row>
              <Row className={css.inputRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].PLANNED_EXECUTION_TIME}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  {this.validator.validate(
                    (handleBlur, shouldMarkError) => (
                      <ValidatedInput
                        elementType="date"
                        placeholder={localize[lang].PLANNED_EXECUTION_TIME}
                        value={plannedExecutionTime || ''}
                        onBlur={handleBlur}
                        shouldMarkError={shouldMarkError}
                        disabledDataRanges={[{ before: new Date() }]}
                        onDayChange={date =>
                          this.handleChangeGoalForms('plannedExecutionTime')({
                            target: { value: date }
                          })
                        }
                        errorText={errorCreateGoal.plannedExecutionTime || localize[lang].PLANNED_EXECUTION_TIME}
                      />
                    ),
                    'plannedExecutionTime',
                    errors.plannedExecutionTime
                  )}
                </Col>
              </Row>
              <Row className={css.createButton} center="xs">
                <Col xs>
                  <Button
                    text={localize[lang].ADD_GOAL}
                    type="green"
                    htmlType="submit"
                    onClick={this.handleAddGoal(isEdit ? goalItem.id : item.id)}
                    disabled={false}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </form>
          </div>
        </Modal>
        {isFetching ? <Loader /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isFetching: state.Goals.isFetching,
  isSuccess: state.Goals.isSuccess,
  errorCreateGoal: state.Goals.errorCreateGoal
});

export default connect(mapStateToProps)(AddGoal);
