import React, {Component} from 'react';
import TestingCaseReference from './index';
import testSuites from './testSuites.json';
import testCases from './testCases.json';
import Button from '../Button';
import { TestCaseInfo, TestSuiteInfo } from './Types';

export default class TCRDemoPage extends Component<any, any> {
  render () {
    const cases =  [ ...testCases.withTestSuite, ...testCases.withoutTestSuite ];

    let ref: TestingCaseReference | null = null;

    const topButtons = () => (
      <Button
        onClick={() => {
          if (ref != null) {
            alert(JSON.stringify(ref.selection))
          }
        }}
        type="primary"
        text="Top button"
        icon="IconPlus"
        name="right"
      />
    );

    const filterAddPlace = () => (
      <Button
        onClick={() => alert('filterAddPlace click')}
        type="primary"
        text="filterAdd"
        icon="IconPlus"
        name="right"
      />
    );

    const suiteActionPlace = (suite: TestSuiteInfo) => {
      if (suite.id) {
        return (<h3 onClick={(e) => {e.stopPropagation(); alert('suiteActionPlace')}}>suiteActionPlace</h3>)
      } else {
        return (<h3>No action</h3>)
      }
    }

    const cardActionsPlace = (testCase: TestCaseInfo) => {
      return (<a href='#' onClick={(e) => {e.stopPropagation(); alert('cardActionsPlace'); return false}}>cardActionsPlace</a>)
    }

    const cardTitleDraw = (testCase: TestCaseInfo) => {
      return (<span style={{marginRight: '5px'}}>{testCase.title}</span>)
    }

    return (
        <TestingCaseReference
          lang='ru'
          ref={(instance) => ref = instance}
          title = '[Epic] - Testing Case Reference'
          header = '12'
          selectable
          testCases = {cases}
          testSuites = {testSuites}
          topButtons = { topButtons }
          filterAddPlace = {filterAddPlace}
          suiteActionPlace = { suiteActionPlace }
          cardActionsPlace = { cardActionsPlace }
          cardTitleDraw = { cardTitleDraw }
        />
    );
  }
}
