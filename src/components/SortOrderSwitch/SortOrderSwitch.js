import React, {PropTypes} from 'react';
import SortOrderIcon from '../../components/SortOrderIcon/SortOrderIcon';
import sortOrder from '../../utils/sortOrder';
import IconButton from 'material-ui/IconButton';

const SortOrderSwitch = (props) => {
  const css = require('./sortOrderSwitch.scss');
  const { order, value, onChange, label, color, style } = props;

  const touchTapHandler = () => {
    onChange(value);
  };

  return (
    <div className={css.switch} style={{...style}}>
      <IconButton onTouchTap={touchTapHandler}>
        <SortOrderIcon color={color} order={order[value]}/>
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
  style: PropTypes.object
};

SortOrderSwitch.defaultProps = {
  order: sortOrder.DIRECTION.NONE
};

export default SortOrderSwitch;
