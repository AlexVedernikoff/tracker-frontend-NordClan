import React, { Component } from 'react';
import * as css from './Toggle.scss';

class Toggle extends Component {
  state = {
    isChecked: false,
    lang: 'en'
  };

  handleChecked = () => {
    this.setState(
      {
        isChecked: !this.state.isChecked,
        lang: this.state.lang === 'ru' ? 'en' : 'ru'
      },
      () => {
        this.props.onChange(this.state.lang);
      }
    );
  };

  render() {
    const { isChecked } = this.state;
    return (
      <div className={css.wrap}>
        <label className={css.toggle}>
          <input type="checkbox" checked={isChecked} onChange={this.handleChecked} />
          <span className={css.slider} />
        </label>
      </div>
    );
  }
}

export default Toggle;
