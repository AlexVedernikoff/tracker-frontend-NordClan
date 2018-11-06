import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './Finish.json';
import * as css from './Finish.scss';

import Button from '../../../Button';

class FinishForm extends Component {
  static propTypes = {
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    previousStep: PropTypes.func,
    project: PropTypes.object,
    token: PropTypes.string
  };

  render() {
    const { lang, nextStep, previousStep, project, token } = this.props;
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{localize[lang].SYNC_HEADER}</p>
        </h3>
        <hr />
        <label className={css.formField} />
        <div>{localize[lang].SYNC_BODY}</div>
        <div className={css.buttonsContainer}>
          <Button text="Нет" onClick={() => previousStep()} type="green" />
          <Button text="Да" onClick={() => nextStep({ 'X-Jira-Auth': token }, project.externalId)} type="green" />
        </div>
      </div>
    );
  }
}

export default FinishForm;
