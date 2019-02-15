import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';

import { IconPlus, IconDownload, IconArrowRight, IconArrowDown } from '../../../../components/Icons';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import TextArea from '../../../../components/TextArea';
import DatepickerDropdown from '../../../../components/DatepickerDropdown';
import Checkbox from '../../../../components/Checkbox';
import Button from '../../../../components/Button';
import TimeLine from '../TimeLine';
import styles from './Sprint.scss';
import * as css from '../Task/CreateMilestoneModal/CreateMilestoneModal.scss';
import Goal from '../Goal';
import localize from './Sprint.json';

const formLayout = {
  firstCol: 4,
  secondCol: 8
};

class Sprint extends Component {
  static propTypes = {
    create: PropTypes.func,
    globalEnd: PropTypes.number,
    globalStart: PropTypes.number,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      showModal: false,
      forms: {
        sprintId: null,
        name: '',
        description: '',
        visible: true,
        plannedExecutionTime: ''
      }
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapsed: !state.collapsed }));
  };

  handleChangeGoalForms = name => ({ target: { value } }) =>
    this.setState({
      forms: {
        ...this.state.forms,
        [name]: value
      }
    });

  handleAddGoal = sprintId => _ => {
    const { forms } = this.state;
    this.setState({ showModal: false });
    this.props.create({
      ...forms,
      sprintId,
      plannedExecutionTime: moment(forms.plannedExecutionTime).unix()
    });
  };

  render() {
    const { item, globalStart, globalEnd, lang } = this.props;
    const {
      collapsed,
      showModal,
      forms: { visible }
    } = this.state;

    const goals = item.goals.map(goal => <Goal key={goal.id} item={goal} />);
    const meta = (
      <div className={styles.meta}>
        <div className={styles.metaItem}>{item.budget} ч.</div>
        <div className={styles.metaItem}>{item.riskBudget} ч. - риск.</div>
        <div className={styles.metaItem}>{item.qaPercent}% на QA</div>
        <div className={`${styles.metaItem}, ${styles.export}`}>
          <IconDownload data-tip="Выгрузить спринт" />
        </div>
      </div>
    );
    const goalsContainer = (
      <div className={styles.goals} onClick={() => this.setState({ showModal: true })}>
        <div>{goals}</div>
        <div className={styles.addingButton}>
          <span className={styles.addingIcon}>
            <IconPlus />
          </span>
          {localize[lang].ADD_GOAL}
        </div>
      </div>
    );
    return (
      <div className={styles.sprint}>
        <div className={styles.collapseIcon} onClick={this.toggleCollapse}>
          {collapsed ? <IconArrowRight /> : <IconArrowDown />}
        </div>
        <div className={styles.leftBlock}>
          <h2>{item.name}</h2>
          {!collapsed && meta}
        </div>
        <div className={styles.rightBlock}>
          <TimeLine
            globalStart={globalStart}
            globalEnd={globalEnd}
            sprintStart={item.factStartDate}
            sprintEnd={item.factFinishDate}
          />
          {!collapsed && goalsContainer}
        </div>
        <Modal isOpen={showModal} onRequestClose={() => this.setState({ showModal: false })} contentLabel="modal">
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
                  <Input placeholder={localize[lang].ENTER_GOAL_NAME} onChange={this.handleChangeGoalForms('name')} />
                </Col>
              </Row>

              <Row className={css.inputRow}>
                <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                  <p>{localize[lang].DESCRIPTION_GOAL}</p>
                </Col>
                <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                  <TextArea
                    onChange={this.handleChangeGoalForms('description')}
                    placeholder={localize[lang].ENTER_DESCRIPTION_GOAL}
                  />
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
                  <DatepickerDropdown
                    name="plannedExecutionTime"
                    placeholder={localize[lang].PLANNED_EXECUTION_TIME}
                    disabledDataRanges={[{ before: new Date() }]}
                    onDayChange={date =>
                      this.handleChangeGoalForms('plannedExecutionTime')({
                        target: { value: +moment(date).format('X') }
                      })
                    }
                  />
                </Col>
              </Row>
              <Button
                text={localize[lang].ADD_GOAL}
                type="green-lighten"
                onClick={this.handleAddGoal(item.id)}
                disabled={false}
                style={{ width: '100%' }}
              />
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(Sprint);
