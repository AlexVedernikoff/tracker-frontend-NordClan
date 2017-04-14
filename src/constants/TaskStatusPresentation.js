/**
 * @exports {TaskStatusEntry[]} TaskStatusPresentation - Список возможных статусов задачи
 */
 import {
   ActionCheckCircle,
   AlertWarning,
   AvPauseCircleFilled,
   AvPlayCircleFilled,
   ImageAdjust,
   ImagePanoramaFishEye,
   NotificationDoNotDisturbOn,
   PlacesAcUnit
 } from 'material-ui/svg-icons';

/**
 * @typedef TaskStatusEntry
 * @property {string} key - код статуса (возвращаемый сервером данных)
 * @property {string} label - отображаемое название статуса
 * @property {React.Component} icon - компонент иконки статуса
 * @property {object} [iconProps] - набор props для компонента иконки (color, hoverColor и style)
 */
 const TaskStatusPresentation = [
  { key: 'New', label: 'Новый', icon: ImagePanoramaFishEye },
  { key: 'In Process', label: 'В процессе', icon: AvPlayCircleFilled, iconProps: { color: 'green' } },
  { key: 'Proposed', label: 'На проверке', icon: ImageAdjust },
  { key: 'Needs Attention', label: 'Требует внимания', icon: AlertWarning, iconProps: { color: 'orange' } },
  { key: 'Interrupted', label: 'Прерван', icon: AvPauseCircleFilled },
  { key: 'Deferred', label: 'Заморожен', icon: PlacesAcUnit, iconProps: { color: 'blue' } },
  { key: 'Completed', label: 'Завершен', icon: ActionCheckCircle },
  { key: 'Off Track', label: 'Отклонен', icon: NotificationDoNotDisturbOn }
 ];

 export default TaskStatusPresentation;
