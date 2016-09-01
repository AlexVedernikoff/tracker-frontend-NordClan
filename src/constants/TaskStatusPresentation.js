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
  {key: 'Новый', label: 'Новый', icon: ImagePanoramaFishEye},
  {key: 'В процессе', label: 'В процессе', icon: AvPlayCircleFilled, iconProps: {color: 'green'}},
  {key: 'На проверке', label: 'На проверке', icon: ImageAdjust},
  {key: 'Требует внимания', label: 'Требует внимания', icon: AlertWarning, iconProps: {color: 'orange'}},
  {key: 'Прерван', label: 'Прерван', icon: AvPauseCircleFilled},
  {key: 'Заморожен', label: 'Заморожен', icon: PlacesAcUnit, iconProps: {color: 'blue'}},
  {key: 'Завершен', label: 'Завершен', icon: ActionCheckCircle},
  {key: 'Отклонен', label: 'Отклонен', icon: NotificationDoNotDisturbOn}
 ];

 export default TaskStatusPresentation;
