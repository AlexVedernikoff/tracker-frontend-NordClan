import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import flow from 'lodash/flow';

import Environment from './Environment';

import {
  addEnvironmentElement,
  deleteEnvironmentElement,
  purgeProjectEnvironment,
  getProjectEnvironment
} from '../../../../../actions/Project';

export default flow(
  withRouter,
  connect(
    state => ({
      projectEnvironment: state.Project.project.environment,
      lang: state.Localize.lang
    }),
    {
      addEnvironmentElement,
      deleteEnvironmentElement,
      purgeProjectEnvironment,
      getProjectEnvironment
    }
  )
)(Environment);
