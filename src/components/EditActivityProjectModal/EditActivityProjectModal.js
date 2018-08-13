import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../components/Modal';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Button from '../Button';
import SelectDropdown from '../../components/SelectDropdown';
import { connect } from 'react-redux';
import { getProjectsForSelect } from '../../actions/Timesheets';
import * as css from './EditActivityProjectModal.scss';
import { changeProject, getTasksForSelect } from '../../actions/Timesheets';
import { getProjectSprints } from '../../actions/Project';

class EditActivityProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      projectValue: null
    };
  }

  componentWillMount() {
    this.props.getProjectsForSelect('', false).then(options =>
      this.setState({
        projects: options.options,
        projectValue: options.options.find(proj => proj.value === this.props.selectedProject)
      })
    );
  }

  handleChangeProject = option => {
    this.props.changeProject(option);
    this.loadTasks('', option ? option.value : null);
    this.props.getProjectSprints(option.value);
    this.setState({ projectValue: option });
  };

  loadTasks = (name = '', projectId = null) => {
    this.props.getTasksForSelect(name, projectId).then(options => this.setState({ tasks: options.options }));
  };

  onConfirm = () => {
    const updatedFields = {
      project: {
        id: this.state.projectValue.body.id,
        name: this.state.projectValue.body.name,
        prefix: this.state.projectValue.body.prefix
      }
    };

    this.props.onConfirm(updatedFields);
  };

  getSprintOptions = () => {
    const { sprints } = this.props;

    return sprints
      ? sprints.map(sprint => {
          return {
            label: sprint.name,
            value: sprint
          };
        })
      : null;
  };

  handleChangeSprint = option => {
    this.setState({ selectedSprint: option });
  };

  render() {
    console.log(this.state);

    const { style, onRequestClose, closeTimeoutMS, text, onConfirm, onCancel, ...other } = this.props;

    const formLayout = {
      firstCol: 4,
      secondCol: 8
    };

    return (
      <Modal {...other} onRequestClose={onCancel} closeTimeoutMS={200 || closeTimeoutMS}>
        <div className={css.container}>
          <h3 style={{ margin: 0 }}>{text}</h3>

          <hr />

          <label className={css.formField}>
            <Row>
              <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
                <p>Проект:</p>
              </Col>

              <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
                <SelectDropdown
                  multi={false}
                  className={css.Select}
                  value={this.state.projectValue}
                  placeholder="Выберите проект"
                  onChange={this.handleChangeProject}
                  options={this.state.projects}
                />
              </Col>
            </Row>
          </label>

          <label className={css.formField} key="noTaskActivitySprint">
            <Row>
              <Col xs={12} sm={formLayout.firstCol}>
                Спринт:
              </Col>
              <Col xs={12} sm={formLayout.secondCol}>
                <SelectDropdown
                  multi={false}
                  value={this.state.selectedSprint}
                  placeholder="Выберите спринт"
                  onChange={this.handleChangeSprint}
                  options={this.getSprintOptions()}
                />
              </Col>
            </Row>
          </label>

          <Button
            text="ОК"
            disabled={!this.state.projectValue}
            type="green"
            style={{ width: '50%' }}
            onClick={this.onConfirm}
          />
          <Button text="Отмена" type="primary" onClick={onCancel} style={{ width: '50%' }} />
        </div>
      </Modal>
    );
  }
}

EditActivityProjectModal.propTypes = {
  changeProject: PropTypes.func,
  closeTimeoutMS: PropTypes.number,
  error: PropTypes.object,
  getProjectsForSelect: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onRequestClose: PropTypes.func,
  selectedProject: PropTypes.number,
  style: PropTypes.object,
  text: PropTypes.string
};

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints
});

const mapDispatchToProps = {
  getProjectsForSelect,
  changeProject,
  getTasksForSelect,
  getProjectSprints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditActivityProjectModal);
