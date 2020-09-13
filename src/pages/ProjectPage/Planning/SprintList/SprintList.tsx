import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';

import * as css from './SprintList.scss';
import localize from './SprintList.json';

import CreateSprintModal from '../../CreateSprintModal';
import CreateMilestoneModal from '../CreateMilestoneModal';

import SprintCard from '../../../../components/SprintCard';
import Button from '../../../../components/Button';
import { IconArrowDown, IconArrowRight } from '../../../../components/Icons';

class SprintList extends React.Component {
  static propTypes = {
    canEditPlan: PropTypes.bool,
    isExternal: PropTypes.bool.isRequired,
    isProjectAdmin: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    onMouseOutRow: PropTypes.func.isRequired,
    onMouseOverRow: PropTypes.func.isRequired,
    sprints: PropTypes.array,
    typeHovered: PropTypes.string,
    typeIdHovered: PropTypes.number
  };

  state = {
    isOpenSprintList: false,
    isModalOpenAddSprint: false,
    isModalOpenAddMilestone: false
  };

  handleOpenModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: true });
  };

  handleCloseModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: false });
  };

  handleOpenModalAddMilestone = () => {
    this.setState({ isModalOpenAddMilestone: true });
  };

  handleCloseModalAddMilestone = () => {
    this.setState({ isModalOpenAddMilestone: false });
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpenSprintList: !prevState.isOpenSprintList
    }));
  };

  render() {
    const { lang, sprints, typeHovered, typeIdHovered, isExternal, isProjectAdmin, canEditPlan } = this.props;

    if (!sprints) {
      return null;
    }

    return (
      <div>
        {isProjectAdmin ? (
          <Button
            text={localize[lang].SPRINT}
            type="primary"
            style={{ float: 'right', marginTop: '-.2rem' }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddSprint}
          />
        ) : null}
        {isProjectAdmin ? (
          <Button
            text={localize[lang].MILESTONE}
            type="primary"
            style={{ float: 'right', marginTop: '-.2rem', marginRight: '5px' }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddMilestone}
          />
        ) : null}
        <div className={css.sprintList}>
          <h2 className={css.name} onClick={this.toggleOpen}>
            {this.state.isOpenSprintList ? <IconArrowDown /> : <IconArrowRight />}
            {localize[lang].SPRINTS_AND_PHASES}
          </h2>
          {this.state.isOpenSprintList ? (
            <Row>
              {sprints.map((element, i) => (
                <Col xs={12} sm={6} md={3} key={`sprint-${i}`}>
                  <SprintCard
                    sprint={element}
                    inFocus={typeHovered === 'sprint' && element.id === typeIdHovered}
                    onMouseOver={this.props.onMouseOverRow('sprint', element.id)}
                    onMouseOut={this.props.onMouseOutRow}
                    isExternal={isExternal}
                    canEditPlan={canEditPlan}
                  />
                </Col>
              ))}
            </Row>
          ) : null}
        </div>
        {this.state.isModalOpenAddSprint ? <CreateSprintModal onClose={this.handleCloseModalAddSprint} /> : null}
        {this.state.isModalOpenAddMilestone ? (
          <CreateMilestoneModal onClose={this.handleCloseModalAddMilestone} />
        ) : null}
      </div>
    );
  }
}

export default SprintList;
