import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Wizard.scss';

// TODO: базовый визард - шаги визарда вынести отдельно и прокидывать в пропсы
class Wizard extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {} = this.props;
    const {} = this.state;

    return <div />;
  }
}

export default Wizard;
