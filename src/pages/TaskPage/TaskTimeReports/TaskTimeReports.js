import React from 'react';

import { connect } from 'react-redux';

import * as css from './TaskTimeReports.scss';
import { getTaskSpent } from '../../../actions/Task';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import getColor from '../../../utils/Colors';

class TaskTimeReports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stageData: {
        stages: [],
        dataSet: [],
        colors: []
      }
    };
  }

  componentDidMount = () => {
    this.loadSpent();
  };

  componentWillReceiveProps(nextProps) {
    this.getStageData(nextProps.timeSpent);
  }

  getStageData = timeSpent => {
    const stages = [];
    const dataSet = [];
    const colors = [];

    if (timeSpent) {
      for (const stage in timeSpent) {
        if (timeSpent.hasOwnProperty(stage)) {
          stages.push(stage);
          dataSet.push(timeSpent[stage]);
          colors.push(getColor());
        }
      }

      this.setState({
        stageData: {
          stages,
          dataSet,
          colors
        }
      });
    }
  };

  loadSpent = () => {
    this.props.getTaskSpent(this.props.params.taskId);
  };

  render() {
    const { dataSet, stages, colors } = this.state.stageData;
    const stageData = {
      labels: stages,
      datasets: [
        {
          data: dataSet,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };

    return (
      <div className={css.history}>
        <h3>Отчеты по времени</h3>
        <Row>
          <Col xs={4}>
            <h4>по стадиям</h4>
            <Doughnut data={stageData} />
          </Col>
        </Row>
      </div>
    );
  }
}

TaskTimeReports.propTypes = {
  getTaskSpent: PropTypes.func.isRequired,
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    taskId: PropTypes.string.isRequired
  }),
  timeSpent: PropTypes.object
};

const mapStateToProps = state => ({
  timeSpent: state.Task.timeSpent
});

const mapDispatchToProps = {
  getTaskSpent
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskTimeReports);
