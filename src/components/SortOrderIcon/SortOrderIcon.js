import React, {PropTypes} from 'react';
import sortOrder from '../../utils/sortOrder';
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';

const SortOrderIcon = (props) => {
  const { order, style, color } = props;

  const Icon = (order === sortOrder.DIRECTION.ASC) ? ArrowDownward : ArrowUpward;
  const arrowColor = (color) || (order === sortOrder.DIRECTION.NONE ? 'rgba(0, 0, 0, 0.54)' : 'rgba(0, 0, 0, 0.87)');

  return (
    <Icon color={arrowColor} style={{height: 16, ...style}} />
  );
};

SortOrderIcon.propTypes = {
  order: PropTypes.oneOf(sortOrder.SEQUENCE),
  style: PropTypes.object,
  color: PropTypes.string
};

SortOrderIcon.defaultProps = {
  order: sortOrder.DIRECTION.NONE
};

export default SortOrderIcon;
