import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Add from 'material-ui/svg-icons/content/add';
import TaskStatusPresentation from '../../constants/TaskStatusPresentation';

import styles from './ButtonChangeStatus.scss';

const renderLabel = (isCompact, currentStatus) => {
  if (!isCompact && currentStatus) {
    return <span className={styles.label}>{currentStatus.label}</span>;
  }
  return null;
};

const renderIcon = currentStatus => currentStatus ?
  <currentStatus.icon {...currentStatus.iconProps} /> : <Add />;

const ButtonChangeStatus = (props) => {
  const { status, compact, style, handleChangeStatus } = props;
  const currentStatus = TaskStatusPresentation.find(stat => (stat.key === status));

  let menuItem = [];
  menuItem = TaskStatusPresentation.map(stat => (
    <MenuItem
      key={stat.key} value={stat.key}
      primaryText={stat.label} leftIcon={<stat.icon {...stat.iconProps} />}
      style={{ cursor: 'pointer' }}
    />
  ));

  const label = renderLabel(compact, currentStatus);
  const icon = renderIcon(currentStatus);
  const renderIconMenu = (
    <IconMenu
      iconButtonElement={
        <div>
          {label}
          <IconButton>{icon}</IconButton>
        </div>
    } onChange={() => handleChangeStatus}
    >
      {menuItem}
    </IconMenu>);

  return (
    <div style={style}>
      {renderIconMenu}
    </div>
  );
};

ButtonChangeStatus.propTypes = {
  status: PropTypes.string.isRequired,
  style: PropTypes.object,
  compact: PropTypes.bool,
  handleChangeStatus: PropTypes.func
};

ButtonChangeStatus.defaultProps = {
  compact: false
};

export default ButtonChangeStatus;
