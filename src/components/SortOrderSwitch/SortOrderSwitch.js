import React, {PropTypes} from 'react';
import SortOrderIcon from '../../components/SortOrderIcon/SortOrderIcon';

const SortOrderSwitch = (props) => {
  const { order, label, color, style } = props;
  const styles = {
    switch: {
      cursor: 'pointer',
      display: 'flex',
      ...style
    }
  };

  return (
    <div style={styles.switch}>
      <SortOrderIcon color={color} order={order}/>
      <div>{label}</div>
    </div>
  );
};

SortOrderSwitch.propTypes = {
  order: PropTypes.oneOf(['none', 'asc', 'desc']),
  label: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object
};

SortOrderSwitch.defaultProps = {
  order: 'none'
};

export default SortOrderSwitch;
