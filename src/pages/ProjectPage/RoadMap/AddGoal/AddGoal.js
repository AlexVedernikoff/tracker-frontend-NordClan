import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import schema from './schema';
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

  handleAddGoal = sprintId => () =>
    schema(this.props.lang)
      .validate(this.state.forms, { abortEarly: false })
      .then(values => {
        const {
          isEdit,
          item: { projectId }
        } = this.props;
        const plannedExecutionTime = +moment(values.plannedExecutionTime, 'DD.MM.YYYY').format('X') / 100;
        const data = { ...values, plannedExecutionTime, projectId, sprintId };
        this.props.closeModal();
        return isEdit ? this.props.edit(data) : this.props.create(data);
      })
      .catch(({ inner }) =>
        this.setState({
          errors: Object.assign({}, ...inner.map(({ path, message }) => ({ [path]: message })))
        })
      );

  render() {
    const {
      forms: { name, visible, plannedExecutionTime, description },
      errors
    } = this.state;
    const { showModal, lang, item, closeModal, isFetching, isEdit, goalItem } = this.props;
    const { fields } = schema(this.props.lang).describe();
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
                    handleBlur => (
                      <ValidatedInput
                        placeholder={fields.name.label}
                        onChange={this.handleChangeGoalForms('name')}
                        value={name}
                        onBlur={handleBlur}
                        shouldMarkError={!!errors.name}
                        errorText={errors.name}
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
                    handleBlur => (
                      <ValidatedInput
                        elementType="textarea"
                        placeholder={fields.description.label}
                        onChange={this.handleChangeGoalForms('description')}
                        value={description}
                        onBlur={handleBlur}
                        shouldMarkError={!!errors.description}
                        errorText={errors.description}
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
                    handleBlur => (
                      <ValidatedInput
                        elementType="date"
                        placeholder={fields.plannedExecutionTime.label}
                        value={plannedExecutionTime || ''}
                        onBlur={handleBlur}
                        shouldMarkError={!!errors.plannedExecutionTime}
                        disabledDataRanges={[{ before: new Date() }]}
                        onDayChange={date =>
                          this.handleChangeGoalForms('plannedExecutionTime')({
                            target: { value: date }
                          })
                        }
                        errorText={errors.plannedExecutionTime}
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
  isSuccess: state.Goals.isSuccess
});

export default connect(mapStateToProps)(AddGoal);
