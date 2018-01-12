import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates';
import BudgetChart from './BudgetChart/BudgetChart';
import BugsChart from './BugsChart/BugsChart';
import SprintReport from './Report';
import { getMetrics } from './../../../actions/Metrics';

class Metrics extends Component {
  static propTypes = {
    completedAt: PropTypes.string,
    createdAt: PropTypes.string,
    metrics: PropTypes.array,
    sprints: PropTypes.array
  }

  constructor (props) {
    super(props);
    // const { getMetrics, params } = this.props;
    
    // //NOTE: Example request to metrics api
    // const metricsParams = {
    //   projectId: parseInt(params.projectId),
    //   typeId: 6,
    //   // sprintId: 1,
    //   // userId: 1,
    //   startDate: '2017-11-20',
    //   endDate: '2017-12-20'
    // };
    
    // getMetrics(metricsParams);
  }

  componentWillMount () {
    const { getMetrics, params } = this.props;
    const metricsParams = {
      projectId: parseInt(params.projectId),
      // typeId: 6,
      // sprintId: 1,
      // userId: 1,
      startDate: '2017-11-20',
      endDate: '2018-01-12'
    };
    getMetrics(metricsParams);
  }

  startDate () {
    if (this.props.createdAt) {
      return this.props.createdAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[0].factStartDate;
    }
    return '';
  }

  endDate () {
    if (this.props.completedAt) {
      return this.props.completedAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[this.props.sprints.length - 1].factFinishDate;
    }
    return '';
  }

  filterByid = (metrics) => {
    
  }

  render () {

    return (
      <div>
        <section className = {css.Metrics}>
          <SprintReport startDate={this.startDate()} endDate={this.endDate()}/>
          <h2>Метрики по проекту</h2>
          <StartEndDates startDate={this.startDate()} endDate={this.endDate()}/>
          <Row>
            <Col md = {12} lg = {6}>
              <BudgetChart startDate={this.startDate()} endDate={this.endDate()}/>
            </Col>
          </Row>
          {/*<Row>*/}
            {/*<Col xs = {12}>*/}
              {/*<BugsChart/>*/}
            {/*</Col>*/}
          {/*</Row>*/}
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  sprints: state.Project.project.sprints,
  metrics: state.Project.project.metrics
});

const mapDispatchToProps = {
  getMetrics
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics);
