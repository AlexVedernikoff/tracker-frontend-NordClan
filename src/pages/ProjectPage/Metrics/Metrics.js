import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates';
import BudgetChart from './BudgetChart/BudgetChart';
import BugsChart from './BugsChart/BugsChart';
import SprintReport from './Report';
import { getMetrics } from './../../../actions/Metrics';

class Metrics extends Component {
  constructor(props) {
    super(props);
    //NOTE: Example request to metrics api
  }

  static propTypes = {
    createdAt: PropTypes.string,
    completedAt: PropTypes.string,
    budget: PropTypes.number,
    riskBudget: PropTypes.number,
    sprints: PropTypes.array
  }

  componentWillMount () {
    const { getMetrics, params } = this.props;
    const metricsParams = {
      projectId: parseInt(params.projectId),
      typeId: 6,
      // sprintId: 1,
      // userId: 1,
      // startDate: '2017-11-20',
      // endDate: '2017-12-20'
    };
    getMetrics(metricsParams);
  }

  startDate () {
    if (this.props.createdAt) {
      return this.props.createdAt;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[0].factStartDate;
    }
    return ''
  }

  endDate () {
    if (this.props.completedDate) {
      return this.props.completedDate;
    } else if (this.props.sprints.length > 0) {
      return this.props.sprints[this.props.sprints.length - 1].factFinishDate;
    }
    return ''
  }

  render () {
    return (
      <div>
        <section className = {css.Metrics}>
          <SprintReport startDate={this.startDate()} endDate={this.endDate()}/>
          {/*<h2>Метрики по проекту</h2>*/}
          {/*<StartEndDates startDate={this.startDate()} endDate={this.endDate()}/>*/}
          {/*<Row>*/}
            {/*<Col md = {12} lg = {6}>*/}
              {/*<BudgetChart startDate={this.startDate()} endDate={this.endDate()}/>*/}
            {/*</Col>*/}
          {/*</Row>*/}
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
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  sprints: state.Project.project.sprints,
  metrics: state.Project.project.metrics
});

const mapDispatchToProps = {
  getMetrics
}

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
