import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from './StatusCheckbox.scss';

const StatusCheckbox = (props) => {
  const {
    checked,
    label,
    type,
    ...other
  } = props;

  return (
    <label
    {...other}
    className={classnames({
      [css.statusCheckbox]: true,
      [css.checked]: checked
    })}>
      {type ? <span className={classnames([css.marker], [css[type]])}/> : null}
      <span>{label}</span>
    </label>
  );
};

StatusCheckbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string
};

export default StatusCheckbox;

