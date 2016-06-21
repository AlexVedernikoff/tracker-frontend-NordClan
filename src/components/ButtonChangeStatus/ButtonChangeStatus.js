import React, {PropTypes} from 'react';
import IconMenu from 'material-ui/IconMenu/IconMenu';
import IconButton from 'material-ui/IconButton/IconButton';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Add from 'material-ui/svg-icons/content/add';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import AvPauseCircleFilled from 'material-ui/svg-icons/av/pause-circle-filled';
import AvPlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import ImageAdjust from 'material-ui/svg-icons/image/adjust';
import ImagePanoramaFishEye from 'material-ui/svg-icons/image/panorama-fish-eye';
import NotificationDoNotDisturbOn from 'material-ui/svg-icons/notification/do-not-disturb-on';

const ButtonChangeStatus = (props, context) => {
  const {status} = props;

  // TODO: вынести наружу перечень доступных статусов, их локализацию и отображение
  return (
    <IconMenu
      tooltip={status}
      iconButtonElement={<IconButton><Add /></IconButton>}
    >
       <MenuItem primaryText="Новый" leftIcon={<ImagePanoramaFishEye />} />
       <MenuItem primaryText="В процессе" leftIcon={<AvPlayCircleFilled />} />
       <MenuItem primaryText="На проверке" leftIcon={<ImageAdjust />} />
       <MenuItem primaryText="Требует внимания" leftIcon={<AlertWarning />} />
       <MenuItem primaryText="Остановлен" leftIcon={<AvPauseCircleFilled />} />
       <MenuItem primaryText="Завершен" leftIcon={<ActionCheckCircle />} />
       <MenuItem primaryText="Отклонен" leftIcon={<NotificationDoNotDisturbOn />} />
    </IconMenu>
  );
};

ButtonChangeStatus.propTypes = {
  status: PropTypes.string.isRequired
};

export default ButtonChangeStatus;
