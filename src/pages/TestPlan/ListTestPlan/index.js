import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListTestPlan from './ListTestPlan';

class ListTestPlanContainer extends Component {
  render() {
    return <ListTestPlan />;
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListTestPlanContainer);
