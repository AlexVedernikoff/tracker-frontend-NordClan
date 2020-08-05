import PhaseColumn from './PhaseColumn';

import { DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import { connect } from 'react-redux';
import { TASK_CARD } from '../../../../constants/DragAndDrop';

export default flow(
  DropTarget(
    TASK_CARD,
    {
      canDrop(props, monitor) {
        return props.section === monitor.getItem().section;
      },
      drop(props, monitor) {
        props.onDrop(monitor.getItem(), props.title);
      }
    },
    (connectDnd, monitor) => {
      return {
        connectDropTarget: connectDnd.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      };
    }
  ),
  connect(state => ({
    isTasksLoad: state.Tasks.isReceiving,
    isProjectLoading: state.Project.isProjectInfoReceiving,
    allTasksLength: state.Tasks.tasks.length,
    lang: state.Localize.lang
  }))
)(PhaseColumn);
