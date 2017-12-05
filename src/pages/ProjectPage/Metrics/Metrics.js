import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates'
import BudgetChart from './BudgetChart/BudgetChart'

class Metrics extends Component {
  constructor(props) {
    super(props)
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
        <section>
          <h2>Аналитика</h2>
          <StartEndDates startDate = {this.startDate()} endDate = {this.endDate()}/>
          <Row>
            <Col md = {12} lg = {6}>
              <BudgetChart startDate = {this.startDate()} endDate = {this.endDate()}/>
            </Col>
          </Row>
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
  sprints: state.Project.project.sprints
});
Metrics.propTypes = {
  createdAt: PropTypes.string,
  completedAt: PropTypes.string,
  budget: PropTypes.number,
  riskBudget: PropTypes.number,
  sprints: PropTypes.array
};

export default connect(mapStateToProps)(Metrics)
