import React, {PropTypes} from 'react';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Add from 'material-ui/svg-icons/content/add';
import TaskStatusPresentation from '../../constants/TaskStatusPresentation';

const ButtonChangeStatus = (props) => {
  const {status} = props;

  const currentStatus = TaskStatusPresentation.find(stat => (stat.key === status));

  return (
    <IconMenu
      tooltip={status}
      iconButtonElement={<IconButton>
        {currentStatus && <currentStatus.icon {...currentStatus.iconProps} /> || <Add/> }
      </IconButton>}
    >
      {TaskStatusPresentation.map((stat) => (
        <MenuItem key={stat.key}
          primaryText={stat.label} leftIcon={<stat.icon {...stat.iconProps} />}
          style={{cursor: 'pointer'}}
        />
      ))}
    </IconMenu>
  );
};

ButtonChangeStatus.propTypes = {
  status: PropTypes.string.isRequired
};

export default ButtonChangeStatus;
