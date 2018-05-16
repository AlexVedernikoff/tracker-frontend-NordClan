import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './RadioGroup.scss';
import Radio from '../Radio';

class RadionGroup extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { options, name, value, onChange, ...other } = this.props;

    return (
      <div className={css.group}>
        {options.map(opt => (
          <Radio
            key={opt.value}
            label={opt.text}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange ? () => onChange(opt.value) : null}
          />
        ))}
      </div>
    );
  }
}

export default RadionGroup;
