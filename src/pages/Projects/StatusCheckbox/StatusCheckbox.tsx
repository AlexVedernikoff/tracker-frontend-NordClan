import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './StatusCheckbox.scss';

class StatusCheckbox extends React.Component<any, any> {
  handlerChange = event => {
    const { statusId, onClick } = this.props;
    onClick(event, statusId);
  };

  render() {
    const { checked, label, type, disabled, ...other } = this.props;
    return (
      <label
        {...other}
        className={classnames({
          [css.statusCheckbox]: true,
          [css.checked]: checked,
          [css.disabled]: disabled
        })}
        onClick={!disabled ? this.handlerChange : () => {}}
      >
        {type ? <span className={classnames([css.marker], [css[type]])} /> : null}
        <span>{label}</span>
      </label>
    );
  }
}

(StatusCheckbox as any).propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
};

(StatusCheckbox as any).defaultProps = {
  onClick: () => {}
};

export default StatusCheckbox;
