import React, { PropTypes } from 'react';
import SortOrderIcon from '../../components/SortOrderIcon/SortOrderIcon';
import sortOrder from '../../utils/sortOrder';
import IconButton from 'material-ui/IconButton';

const SortOrderSwitch = (props) => {
  const { order, value, onChange, label, color, style, css } = props;

  const touchTapHandler = () => {
    onChange(value);
  };

  return (
    <div className={css.switch} style={{ ...style }}>
      <IconButton onTouchTap={touchTapHandler}>
        <SortOrderIcon color={color} order={order[value]} />
      </IconButton>
      <div className={css.label}>{label}</div>
    </div>
  );
};

SortOrderSwitch.propTypes = {
  order: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  css: PropTypes.object
};

SortOrderSwitch.defaultProps = {
  order: sortOrder.DIRECTION.NONE,
  css: require('./sortOrderSwitch.scss')
};

export default SortOrderSwitch;
