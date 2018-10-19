import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import localize from './Auth.json';
import * as css from './Auth.scss';

import Input from '../../../Input';
import Button from '../../../Button';

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      server: '',
      email: ''
    };
  }

  onChange = (name, e) => {
    this.setState({
      [name]: e.target.value
    });
  };

  render() {
    const { lang, previousStep, nextStep } = this.props;
    const formLayout = {
      firstCol: 5,
      secondCol: 7
    };
    return (
      <div>
        <h3>
          <p>{localize[lang].AUTH}</p>
        </h3>
        <hr />
        <label className={css.formField}>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].USERNAME}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].USERNAME}
                onChange={e => this.onChange('username', e)}
                value={this.state.username}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].PASSWORD}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].PASSWORD}
                type="password"
                onChange={e => this.onChange('password', e)}
                value={this.state.password}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].SERVER}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].SERVER}
                onChange={e => this.onChange('server', e)}
                value={this.state.server}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={formLayout.firstCol} className={css.leftColumn}>
              {localize[lang].EMAIL}
            </Col>
            <Col xs={12} sm={formLayout.secondCol} className={css.rightColumn}>
              <Input
                placeholder={localize[lang].EMAIL}
                label="email"
                onChange={e => this.onChange('email', e)}
                value={this.state.email}
              />
            </Col>
          </Row>
        </label>
        <Button text="Вперед" onClick={() => nextStep(this.state)} type="green" />
      </div>
    );
  }
}

export default AuthForm;
