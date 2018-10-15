import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './LanguageToggle.scss';
import classNames from 'classnames';

class LanguageToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.lang === 'ru'
    };
  }

  componentDidUpdate = () => {
    if (this.props.lang === 'ru' && this.state.checked !== true) {
      this.setState({ checked: true });
    }
    if (this.props.lang === 'en' && this.state.checked !== false) {
      this.setState({ checked: false });
    }
  };

  handleChecked = ({ target: { checked } }) => {
    this.setState(
      {
        checked
      },
      () => {
        this.props.onChange(!checked ? 'en' : 'ru');
      }
    );
  };

  render() {
    const { checked } = this.state;
    const { location } = this.props;
    return (
      <div className={classNames(css.wrap, css[location])}>
        <span className={css.lang}>EN</span>
        <label className={css.toggle}>
          <input type="checkbox" checked={checked} onChange={this.handleChecked} />
          <span className={css.slider} />
        </label>
        <span className={css.lang}>RU</span>
      </div>
    );
  }
}

LanguageToggle.propTypes = {
  lang: PropTypes.string,
  location: PropTypes.string,
  onChange: PropTypes.func
};

export default LanguageToggle;
