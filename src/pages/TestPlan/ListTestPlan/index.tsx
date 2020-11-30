import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListTestPlan from './ListTestPlan';

class ListTestPlanContainer extends Component<any, any> {
  render() {
    return <ListTestPlan />;
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListTestPlanContainer);
