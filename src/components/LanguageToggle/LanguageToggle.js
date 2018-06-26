import React, { Component } from 'react';
import * as css from './LanguageToggle.scss';

class LanguageToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.lang === 'ru'
    };
  }

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
    return (
      <div className={css.wrap}>
        <label className={css.toggle}>
          <input type="checkbox" checked={checked} onChange={this.handleChecked} />
          <span className={css.slider} />
        </label>
      </div>
    );
  }
}

export default LanguageToggle;
