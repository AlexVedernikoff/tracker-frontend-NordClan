import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib/index';
import StatusCheckbox from './../../../Projects/StatusCheckbox';
import css from './StatusEditor.scss';
import { updateProjectStatus } from '../../../../actions/ProjectStatus';
import { ADMIN } from '../../../../constants/Roles';
import localize from './statusEditor.json';

class StatusEditor extends React.Component<any, any> {
  statusesInfo: [number, string][];

  constructor(props) {
    super(props);
    this.statusesInfo = [[1, 'INPROGRESS'], [2, 'INHOLD'], [3, 'FINISHED']];
  }

  switchStatus = (event, statusId) => {
    const { projectId } = this.props;
    this.props.updateProjectStatus(projectId, statusId);
  };

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.projectId) !== -1) ||
      this.props.user.globalRole === ADMIN
    );
  };

  render() {
    const { updatedStatusId, currentStatusId, lang } = this.props;

    const isProjectAdmin = this.checkIsAdminInProject();

    return (
      <div className={css.container}>
        <h2>{localize[lang].STATUS}</h2>
        <Row>
          {this.statusesInfo.map(([statusId, type]) => {
            return (
              <StatusCheckbox
                key={type}
                type={type}
                statusId={statusId}
                checked={(updatedStatusId || currentStatusId) === statusId}
                onClick={this.switchStatus}
                label={localize[lang][type]}
                disabled={!isProjectAdmin}
              />
            );
          })}
        </Row>
      </div>
    );
  }
}

(StatusEditor as any).propTypes = {
  currentStatusId: PropTypes.number,
  lang: PropTypes.string.isRequired,
  projectId: PropTypes.number,
  updateProjectStatus: PropTypes.func.isRequired,
  updatedStatusId: PropTypes.number,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projectId: state.Project.project.id,
  currentStatusId: state.Project.project.statusId,
  updatedStatusId: state.Project.project.updatedStatusId,
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  updateProjectStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusEditor);
