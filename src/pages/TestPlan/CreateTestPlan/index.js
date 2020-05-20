import React, { Component } from 'react';
import CreateTestPlan from './CreateTestPlan';
import { connect } from 'react-redux';
import { getAllTestCases } from '../../../actions/TestCase';
import { getAllUsers } from '../../../actions/Users';
import propTypes from 'prop-types';

class CreateTestPlanContainer extends Component {
  state = {
    activeTestCaseType: null,
    selectedTestCases: []
  };

  componentDidMount() {
    this.props.getAllTestCases();
    this.props.getAllUsers();
  }

  setActiveTestCaseType = id => {
    this.setState({
      activeTestCaseType: id
    });
  };

  selectTestCases = testCasesArray => {
    this.setState({
      selectedTestCases: [...this.state.selectedTestCases, ...testCasesArray]
    });
  };

  removeTestCases = testCasesArray => {
    console.log('testCasesArray', testCasesArray);
    const { selectedTestCases } = this.state;
    const updatedArray = selectedTestCases.filter(
      selectedItem => !testCasesArray.some(removableItem => removableItem.testCaseId === selectedItem.testCaseId)
    );

    this.setState({
      selectedTestCases: updatedArray
    });
  };

  render() {
    const { activeTestCaseType, selectedTestCases } = this.state;
    console.log(selectedTestCases);
    return (
      <CreateTestPlan
        setActiveTestCaseType={this.setActiveTestCaseType}
        selectTestCases={this.selectTestCases}
        removeTestCases={this.removeTestCases}
        activeTestCaseType={activeTestCaseType}
        selectedTestCases={selectedTestCases}
        {...this.props}
      />
    );
  }
}

const mapDispatchToProps = {
  getAllTestCases,
  getAllUsers
};
const mapStateToProps = state => {
  return {
    testCaseList: state.TestCase.list,
    users: state.UserList.users,
    lang: state.Localize.lang
  };
};

CreateTestPlanContainer.propTypes = {
  getAllTestCases: propTypes.func,
  getAllUsers: propTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestPlanContainer);
