import React, { Component } from 'react';
import CreateTestPlan from './CreateTestPlan';
import { connect } from 'react-redux';
import { getAllTestCases } from '../../../actions/TestCase';
import { getAllUsers } from '../../../actions/Users';
import { createTestPlan } from '../../../actions/TestPlan';
import propTypes from 'prop-types';
import moment from 'moment';
import { uniqueId } from 'lodash';

class CreateTestPlanContainer extends Component<any, any> {
  constructor(props) {
    super(props);
    this.initialState = {
      activeTestCaseType: null,
      testCasesData: [],
      title: '',
      description: '',
      runtime: null,
      textareaKey: uniqueId()
    };
    this.state = this.initialState;
  }

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
      testCasesData: [...this.state.testCasesData, ...testCasesArray]
    });
  };

  updateTestCases = testCasesArray => {
    const testCasesDataCopy = [...this.state.testCasesData];
    testCasesArray.forEach(testCaseItem => {
      const selectedTestCaseToUpdateIndex = testCasesDataCopy.findIndex(
        item => item.testCaseId === testCaseItem.testCaseId
      );
      if (selectedTestCaseToUpdateIndex !== -1) {
        testCasesDataCopy[selectedTestCaseToUpdateIndex] = testCaseItem;
      } else {
        testCasesDataCopy.push(testCaseItem);
      }
    });
    this.setState({
      testCasesData: testCasesDataCopy
    });
  };

  removeTestCases = testCasesArray => {
    const { testCasesData } = this.state;
    const updatedArray = testCasesData.filter(
      selectedItem => !testCasesArray.some(removableItem => removableItem.testCaseId === selectedItem.testCaseId)
    );

    this.setState({
      testCasesData: updatedArray
    });
  };

  handleCreateTestPlan = () => {
    const { title, description, runtime, testCasesData } = this.state;
    this.props.createTestPlan({
      title,
      description,
      runtime: moment(runtime).format('HH:mm:ss'),
      testCasesData
    });
    this.setState({
      ...this.initialState,
      textareaKey: uniqueId()
    });
  };

  handleChangeInput = e => {
    this.setState({
      title: e.target.value
    });
  };

  handleChangeTextarea = editorState => {
    this.setState({ description: editorState.getCurrentContent().getPlainText() });
  };

  handleRuntimeChange = runtime => {
    this.setState({
      runtime
    });
  };

  render() {
    const { activeTestCaseType, testCasesData, title, description, runtime, textareaKey } = this.state;
    return (
      <CreateTestPlan
        setActiveTestCaseType={this.setActiveTestCaseType}
        selectTestCases={this.selectTestCases}
        removeTestCases={this.removeTestCases}
        updateTestCases={this.updateTestCases}
        activeTestCaseType={activeTestCaseType}
        testCasesData={testCasesData}
        handleCreateTestPlan={this.handleCreateTestPlan}
        title={title}
        description={description}
        runtime={runtime}
        handleChangeInput={this.handleChangeInput}
        handleChangeTextarea={this.handleChangeTextarea}
        handleRuntimeChange={this.handleRuntimeChange}
        textareaKey={textareaKey}
        {...this.props}
      />
    );
  }
}

const mapDispatchToProps = {
  getAllTestCases,
  getAllUsers,
  createTestPlan
};
const mapStateToProps = state => {
  return {
    testCaseList: state.TestCase.list,
    users: state.UserList.users,
    lang: state.Localize.lang
  };
};

(CreateTestPlanContainer as any).propTypes = {
  getAllTestCases: propTypes.func,
  getAllUsers: propTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestPlanContainer);
