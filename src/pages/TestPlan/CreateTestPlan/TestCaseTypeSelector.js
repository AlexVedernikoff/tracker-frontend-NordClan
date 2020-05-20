import React, { Component, PureComponent } from 'react';
import propTypes from 'prop-types';
import Checkbox from '../../../components/Checkbox';
import _ from 'lodash';
import css from './CreateTestPlan.scss';
import classnames from 'classnames';

class TestCaseTypeSelectorItem extends PureComponent {
  render() {
    const {
      isSelected,
      testSuiteName,
      selectedCount,
      allCount,
      handleSelectAll,
      setActiveTestCaseType,
      isActive,
      id,
      activeTestCaseType
    } = this.props;
    return (
      <div
        className={classnames(css.typeSelectorWrapper, {
          [css.active]: isActive
        })}
        onClick={() => setActiveTestCaseType(id === activeTestCaseType ? null : id)}
      >
        <Checkbox checked={isSelected} onChange={handleSelectAll} />
        <div className={css.nameBlock}>{testSuiteName}</div>
        <div>
          ({selectedCount}/{allCount})
        </div>
      </div>
    );
  }
}

class TestCaseTypeSelector extends Component {
  render() {
    const {
      testCaseList: { withTestSuite, withoutTestSuite },
      setActiveTestCaseType,
      activeTestCaseType
    } = this.props;
    return (
      <div>
        {withoutTestSuite.length && (
          <TestCaseTypeSelectorItem
            setActiveTestCaseType={setActiveTestCaseType}
            testSuiteName="Test cases without suite"
            selectedCount={0}
            allCount={withoutTestSuite.length}
            isSelected={false}
            isActive={activeTestCaseType === 0}
            id={0}
            activeTestCaseType={activeTestCaseType}
          />
        )}
        {_.map(withTestSuite, (item, index) => (
          <TestCaseTypeSelectorItem
            key={`test_case_type_selector_item_${index}`}
            setActiveTestCaseType={setActiveTestCaseType}
            testSuiteName={item.title}
            selectedCount={0}
            allCount={item.testCasesData.length}
            isSelected={false}
            isActive={activeTestCaseType === item.id}
            id={item.id}
            activeTestCaseType={activeTestCaseType}
          />
        ))}
      </div>
    );
  }
}

TestCaseTypeSelector.propTypes = {
  activeTestCaseType: propTypes.number,
  id: propTypes.number,
  setActiveTestCaseType: propTypes.func,
  testCaseList: propTypes.object
};

TestCaseTypeSelectorItem.propTypes = {
  activeTestCaseType: propTypes.number,
  allCount: propTypes.number,
  handleSelectAll: propTypes.func,
  id: propTypes.number,
  isActive: propTypes.bool,
  isSelected: propTypes.bool,
  selectedCount: propTypes.number,
  setActiveTestCaseType: propTypes.func,
  testSuiteName: propTypes.string
};

export default TestCaseTypeSelector;
