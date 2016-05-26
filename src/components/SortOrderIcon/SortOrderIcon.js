import React, {PropTypes} from 'react';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

const SortOrderIcon = (props) => {
  const { order, style, color } = props;
  const styles = {
    arrowBlock: {
      height: 16,
      ...style
    }
  };

  const Icon = (order === 'desc') ? ArrowUpward : ArrowDownward;
  const arrowColor = (color) || (order === 'none' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.87)');

  return (
    <Icon color={arrowColor} style={styles.arrowBlock} />
  );
};

SortOrderIcon.propTypes = {
  // TODO: вынести в качестве общей сущности
  order: PropTypes.oneOf(['none', 'asc', 'desc']),
  style: PropTypes.object,
  color: PropTypes.string
};

SortOrderIcon.defaultProps = {
  order: 'none'
};

export default SortOrderIcon;
