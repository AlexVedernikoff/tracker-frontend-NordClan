import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import * as css from './SprintStartControl.scss';
import { IconPlay, IconPause } from '../Icons';
import { editSprint } from '../../actions/Sprint';


class SprintEditModal extends Component {

  static propTypes = {
    editSprint: PropTypes.func.isRequired,
    sprint: PropTypes.object.isRequired
  };

  changeStatus = (sprint) => {
    return () => this.props.editSprint(sprint.id, sprint.statusId === 1 ? 2 : 1);
  };

  render () {
    const { sprint } = this.props;

    return (
      <span
        onClick={this.changeStatus(sprint)}
        className={classnames({
          [css.status]: true,
          [css.inprogress]: sprint.statusId === 2,
          [css.inhold]: sprint.statusId === 1
        })}
        data-tip={sprint.statusId === 2 ? 'Остановить' : 'Запустить'}
      >
        {sprint.statusId === 2 ? <IconPause /> : <IconPlay />}
      </span>
    );
  }
}


const mapDispatchToProps = {
  editSprint
};

export default connect(null, mapDispatchToProps)(SprintEditModal);
