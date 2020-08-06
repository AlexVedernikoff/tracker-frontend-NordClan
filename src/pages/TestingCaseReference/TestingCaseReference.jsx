import React, { Component } from 'react';
import { connect } from 'react-redux';
import Title from '../../components/Title';

import * as css from './TestingCaseReference.scss';
import Button from '../../components/Button';
import ScrollTop from '../../components/ScrollTop';
import CreateTestCaseModal from '../../components/CreateTestCaseModal/CreateTestCaseModal';

class TestingCaseReference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testSuites: {},
      isCreateTestCaseModalOpened: false
    };
  }

  handleModalOpening = () => {
    this.setState({ isCreateTestCaseModalOpened: !this.state.isCreateTestCaseModalOpened });
  };

  render() {
    const { isCreateTestCaseModalOpened } = this.state;
    return (
      <div>
        <Title render={'[Epic] - Testing Case Reference'} />
        <section>
          <header>
            <h1 className={css.title}>Testing Case Reference</h1>
            <div>
              <Button onClick={this.handleModalOpening} text={'Create Test Case'} type="primary" icon="IconPlus" />
            </div>
          </header>
          <hr />
        </section>
        <CreateTestCaseModal isOpen={isCreateTestCaseModalOpened} onClose={this.handleModalOpening} />
        <ScrollTop />
      </div>
    );
  }
}
