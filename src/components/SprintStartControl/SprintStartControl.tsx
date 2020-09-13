import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import * as css from './SprintStartControl.scss';
import { IconPlay, IconPause } from '../Icons';
import { editSprint } from '../../actions/Sprint';
import localize from './SprintEditModal.json';
import { TASK_STATUSES } from '../../constants/TaskStatuses';

class SprintEditModal extends Component {
  static propTypes = {
    editSprint: PropTypes.func.isRequired,
    lang: PropTypes.string,
    sprint: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.sprint.statusId !== this.props.sprint.statusId) {
      ReactTooltip.hide();
    }
  }

  changeStatus = sprint => {
    return () =>
      this.props.editSprint(
        sprint.id,
        sprint.statusId === TASK_STATUSES.NEW ? TASK_STATUSES.DEV_PLAY : TASK_STATUSES.NEW
      );
  };

  render() {
    const { sprint, lang } = this.props;

    return (
      <span
        onClick={this.changeStatus(sprint)}
        className={classnames({
          [css.status]: true,
          [css.inprogress]: sprint.statusId === 2,
          [css.inhold]: sprint.statusId === 1
        })}
        data-tip={sprint.statusId === TASK_STATUSES.DEV_PLAY ? localize[lang].STOP : localize[lang].PLAY}
      >
        {sprint.statusId === TASK_STATUSES.DEV_PLAY ? <IconPause /> : <IconPlay />}
      </span>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  editSprint
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintEditModal);
