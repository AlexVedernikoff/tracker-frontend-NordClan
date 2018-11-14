import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import * as css from './SprintStartControl.scss';
import { IconPlay, IconPause } from '../Icons';
import { editSprint } from '../../actions/Sprint';
import localize from './SprintEditModal.json';

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
    return () => this.props.editSprint(sprint.id, sprint.statusId === 1 ? 2 : 1);
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
        data-tip={sprint.statusId === 2 ? localize[lang].STOP : localize[lang].PLAY}
      >
        {sprint.statusId === 2 ? <IconPause /> : <IconPlay />}
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
