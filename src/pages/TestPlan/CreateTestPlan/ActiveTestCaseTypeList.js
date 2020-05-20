import React, { Component } from 'react';
import propTypes from 'prop-types';
import Checkbox from '../../../components/Checkbox';
import css from './CreateTestPlan.scss';
import SelectDropdown from '../../../components/SelectDropdown';

import getPriorityById from '../../../utils/TaskPriority';

const ActiveTestCaseTypeItem = props => {
  const { data, lang, selectTestCases, selectedTestCases, removeTestCases, optionsSelector } = props;
  const { testCaseSeverity, testCaseStatus, priority, id } = data;
  const selectedLang = lang === 'en' ? 'nameEn' : 'name';
  const selectedCurrentTestCase = selectedTestCases.find(item => item.testCaseId === id);
  const isSelected = typeof selectedCurrentTestCase === 'object';
  const onChangeHandler = isSelected ? removeTestCases : selectTestCases;
  return (
    <div className={css.testCaseItemWrapper}>
      <Checkbox
        checked={isSelected}
        onChange={() =>
          onChangeHandler([
            {
              testCaseId: id,
              assignedTo: null
            }
          ])
        }
      />
      <div className={css.testCaseContent}>
        <div className={css.testCaseTitle}>{data.title}</div>
        <div className={css.testCaseInfoRow}>
          <div>{testCaseSeverity[selectedLang]}</div>
          <div>{getPriorityById(priority)}</div>
          <div>{testCaseStatus[selectedLang]}</div>
        </div>
      </div>
      {isSelected && (
        <SelectDropdown
          options={optionsSelector}
          onChange={value =>
            selectTestCases([
              {
                testCaseId: id,
                assignedTo: value.id
              }
            ])
          }
          value={optionsSelector[selectedCurrentTestCase.assignedTo]}
        />
      )}
    </div>
  );
};

class ActiveTestCaseTypeList extends Component {
  render() {
    const {
      activeTestCaseTypeData,
      selectTestCases,
      selectedTestCases,
      lang,
      removeTestCases,
      optionsSelector
    } = this.props;
    if (!activeTestCaseTypeData) return null;
    return (
      <div>
        {activeTestCaseTypeData.map((item, index) => {
          return (
            <ActiveTestCaseTypeItem
              key={`active_test_case_type_item_${index}`}
              data={item}
              lang={lang}
              selectTestCases={selectTestCases}
              selectedTestCases={selectedTestCases}
              removeTestCases={removeTestCases}
              optionsSelector={optionsSelector}
            />
          );
        })}
      </div>
    );
  }
}

ActiveTestCaseTypeList.propTypes = {
  activeTestCaseTypeData: propTypes.array,
  lang: propTypes.string,
  optionsSelector: propTypes.array,
  removeTestCases: propTypes.func,
  selectTestCases: propTypes.func,
  selectedTestCases: propTypes.array
};

ActiveTestCaseTypeItem.propTypes = {
  data: propTypes.object,
  lang: propTypes.string,
  optionsSelector: propTypes.array,
  removeTestCases: propTypes.func,
  selectTestCases: propTypes.func,
  selectedTestCases: propTypes.array
};

export default ActiveTestCaseTypeList;
