import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localize from './Finish.json';
import * as css from './Finish.scss';

import Button from '../../../Button';

class FinishForm extends Component {
  static propTypes = {
    associateWithJiraProject: PropTypes.func,
    associationState: PropTypes.object,
    jiraProjectId: PropTypes.any,
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    project: PropTypes.object,
    simtrackProjectId: PropTypes.any,
    synchronizeNow: PropTypes.bool,
    token: PropTypes.string
  };

  render() {
    const { lang, nextStep, previousStep, synchronizeNow } = this.props;
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{synchronizeNow ? localize[lang].CONFIRM_SYNC : localize[lang].SYNC_HEADER}</p>
        </h3>
        <hr />
        <label className={css.formField} />
        <div>{synchronizeNow ? null : localize[lang].SYNC_BODY}</div>
        <div className={css.buttonsContainer}>
          <Button text="Нет" onClick={() => previousStep()} type="green" />
          <Button text="Да" onClick={() => nextStep()} type="green" />
        </div>
      </div>
    );
  }
}

export default FinishForm;
