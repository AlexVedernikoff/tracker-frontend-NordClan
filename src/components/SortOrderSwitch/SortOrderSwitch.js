import React, {PropTypes} from 'react';
import SortOrderIcon from '../../components/SortOrderIcon/SortOrderIcon';
import sortOrder from '../../utils/sortOrder';
import IconButton from 'material-ui/IconButton';

const SortOrderSwitch = (props) => {
  const { order, value, onChange, label, color, style } = props;
  const styles = {
    switch: {
      cursor: 'pointer',
      display: 'flex',
      ...style
    },
    label: {
      lineHeight: '48px'
    }
  };

  const touchTapHandler = () => {
    onChange(value);
  };

  return (
    <div style={styles.switch}>
      <IconButton onTouchTap={touchTapHandler}>
        <SortOrderIcon color={color} order={order[value]}/>
      </IconButton>
      <div style={styles.label}>{label}</div>
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
