import React, { Component } from 'react';
import { connect } from 'react-redux';
import TestCaseInfo, { TestCaseInfoProp } from './TestCaseInfo';
import { getLocalizedTestCaseSeverities } from '~/selectors/dictionaries';

const mapStateToProps = state => ({
    severities: getLocalizedTestCaseSeverities(state),
})

const mapDispatchToProps = {};

class TestCaseInfoRedux extends Component<TestCaseInfoProp, any> {

    render() {
        return <TestCaseInfo {...this.props} severities={this.props.severities} />;
    }

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TestCaseInfoRedux);