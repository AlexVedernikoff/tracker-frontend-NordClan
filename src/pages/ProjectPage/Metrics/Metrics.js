import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates'
import BudgetChart from './BudgetChart/BudgetChart'
class Metrics extends Component {
  constructor(props) {
    super(props)    
  }
  render () {
    return (
      <div>
        <section>
          <h2>Аналитика</h2>
          <StartEndDates createdAt = {this.props.createdAt} completedAt = {this.props.completedAt}/>
          <Row>
            <Col md={6}>
              <BudgetChart budget = {this.props.budget} riskBudget = {this.props.riskBudget}/>
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
  riskBudget: state.Project.project.riskBudget
});

const mapDispatchToProps = {
};

Metrics.propTypes = {
  createdAt: PropTypes.string,
  completedAt: PropTypes.string,
  budget: PropTypes.number,
  riskBudget: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
