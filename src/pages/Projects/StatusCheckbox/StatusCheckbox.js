import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from './StatusCheckbox.scss';

class StatusCheckbox extends React.Component {
  handlerChange = (event) => {
    const { statusId, onClick } = this.props;
    onClick(event, statusId);
  }

  render() {
    const { checked, label, type, onChange, statusId, ...other } = this.props;
    return (
      <label
        {...other}
        className={classnames({
          [css.statusCheckbox]: true,
          [css.checked]: checked
        })}
        onClick={this.handlerChange}>
        {type ? <span className={classnames([css.marker], [css[type]])}/> : null}
        <span>{label}</span>
      </label>
    );
  }
};

StatusCheckbox.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  statusId: PropTypes.number,
  type: PropTypes.string
};

StatusCheckbox.defaultProps = {
  onClick: () => {}
}

export default StatusCheckbox;
