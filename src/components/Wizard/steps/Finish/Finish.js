import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './Finish.json';
import * as css from './Finish.scss';

import Input from '../../../Input';
import Button from '../../../Button';

class FinishForm extends Component {
  static propTypes = {
    lang: PropTypes.string,
    nextStep: PropTypes.func
  };

  render() {
    const { lang, nextStep } = this.props;
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{localize[lang].SYNC_HEADER}</p>
        </h3>
        <hr />
        <label className={css.formField} />
        <div>{localize[lang].SYNC_BODY}</div>
        <Button text="Нет" onClick={() => nextStep(this.state)} type="green" />
        <Button text="Да" onClick={() => nextStep(this.state)} type="green" />
      </div>
    );
  }
}

export default FinishForm;
