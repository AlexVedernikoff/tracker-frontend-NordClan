import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './Auth.json';
import * as css from './Auth.scss';

import Input from '../../../Input';
import Button from '../../../Button';

class AuthForm extends Component {
  static propTypes = {
    authData: PropTypes.object,
    lang: PropTypes.string,
    nextStep: PropTypes.func,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { lang, nextStep, onChange, authData } = this.props;
    const formLayout = {
      firstCol: 3,
      secondCol: 9
    };
    return (
      <div className={css.mainContainer}>
        <h3>
          <p>{localize[lang].AUTH}</p>
        </h3>
        <hr />
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].SERVER}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].SERVER}
                onChange={e => onChange('server', e)}
                value={authData.server}
              />
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].USERNAME}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].USERNAME}
                onChange={e => onChange('username', e)}
                value={authData.username}
              />
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].PASSWORD}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].PASSWORD}
                type="password"
                onChange={e => onChange('password', e)}
                value={authData.password}
              />
            </Col>
          </Row>
        </label>
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].EMAIL}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].EMAIL}
                label="email"
                onChange={e => onChange('email', e)}
                value={authData.email}
              />
            </Col>
          </Row>
        </label>
        <div className={css.buttonsContainer}>
          <Button text={localize[lang].GO_AHEAD} onClick={() => nextStep(authData)} type="green" />
        </div>
      </div>
    );
  }
}

export default AuthForm;