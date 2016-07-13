import React, {PropTypes} from 'react';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Add from 'material-ui/svg-icons/content/add';
import TaskStatusPresentation from '../../constants/TaskStatusPresentation';

const ButtonChangeStatus = (props) => {
  const {status, compact, style} = props;
  const styles = {
    label: {
      cursor: 'pointer',
      padding: '12px 0',
      display: 'inline-block',
      verticalAlign: 'top',
      lineHeight: '24px'
    }
  };
  const currentStatus = TaskStatusPresentation.find(stat => (stat.key === status));
  return (
    <div style={style}>
      <IconMenu
        tooltip={status}
        iconButtonElement={
          <div>
            {!compact && currentStatus && <span style={styles.label}>
              {currentStatus.label}
            </span>}
            <IconButton>
              {currentStatus && <currentStatus.icon {...currentStatus.iconProps} /> || <Add/> }
            </IconButton>
        </div>
      }
      >
        {TaskStatusPresentation.map((stat) => (
          <MenuItem key={stat.key}
            primaryText={stat.label} leftIcon={<stat.icon {...stat.iconProps} />}
            style={{cursor: 'pointer'}}
          />
        ))}
      </IconMenu>
    </div>
  );
};

ButtonChangeStatus.propTypes = {
  status: PropTypes.string.isRequired,
  style: PropTypes.object,
  compact: PropTypes.boolean
};

ButtonChangeStatus.defaultProps = {
  compact: false
};

export default ButtonChangeStatus;
