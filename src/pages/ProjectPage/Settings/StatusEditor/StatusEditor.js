import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib/index';
import StatusCheckbox from './../../../Projects/StatusCheckbox';
import * as css from './StatusEditor.scss';
import { updateProjectStatus } from '../../../../actions/ProjectStatus';

class StatusEditor extends React.Component {
  constructor (props) {
    super(props);
    this.statusesInfo = [
      [1, 'INPROGRESS', 'В процессе'],
      [2, 'INHOLD', 'Приостановлен'],
      [3, 'FINISHED', 'Завершен']
    ];
  }

  switchStatus = (event, statusId) => {
    const { updateProjectStatus, projectId } = this.props;
    updateProjectStatus(projectId, statusId);
  };

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.projectId) !== -1;
  };

  render () {
    const { updatedStatusId, currentStatusId } = this.props;

    const isProjectAdmin = this.checkIsAdminInProject();

    return <div className={css.container}>
      <h2>Статус</h2>
      <Row>
        {this.statusesInfo.map(([statusId, type, name]) => {
          return <StatusCheckbox
            key={type}
            type={type}
            statusId={statusId}
            checked={(updatedStatusId || currentStatusId) === statusId}
            onClick={this.switchStatus}
            label={name}
            disabled={!isProjectAdmin}
          />
        })}
      </Row>
    </div>;
  }
}

StatusEditor.propTypes = {
  currentStatusId: PropTypes.number,
  projectId: PropTypes.number,
  updateProjectStatus: PropTypes.func.isRequired,
  updatedStatusId: PropTypes.number,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  currentStatusId: state.Project.project.statusId,
  updatedStatusId: state.Project.project.updatedStatusId,
  user: state.Auth.user
});

const mapDispatchToProps = {
  updateProjectStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusEditor);
