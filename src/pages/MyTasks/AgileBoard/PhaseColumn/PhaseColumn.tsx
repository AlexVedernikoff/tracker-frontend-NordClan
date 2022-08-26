import React from 'react';
import { number, bool, func, string, array } from 'prop-types';
import classnames from 'classnames';

import * as css from './PhaseColumn.scss';
import localize from './PhaseColumn.json';

import InlineHolder from '../../../../components/InlineHolder';

export default class PhaseColumn extends React.Component<any, any> {
  static propTypes = {
    allTasksLength: number.isRequired,
    canDrop: bool.isRequired,
    connectDropTarget: func.isRequired,
    isOver: bool.isRequired,
    isProjectLoading: bool,
    isTasksLoad: bool,
    lang: string,
    onDrop: func.isRequired,
    section: string.isRequired,
    tasks: array,
    title: string.isRequired
  };

  checkboxHandler = (e) => {
    e.stopPropagation()
    this.props.handleSelectAllColumnCard({checked: e.target.checked, tasks: this.props.tasks})
  }

  render() {
    const {
      tasks,
      title,
      connectDropTarget,
      canDrop,
      isOver,
      isTasksLoad,
      allTasksLength,
      isProjectLoading,
      lang,
      isColumnSelected
    } = this.props;

    return connectDropTarget(
      <div
        className={classnames({
          [css.dropColumn]: true,
          [css.canDropColumn]: isOver && canDrop,
          [css.cantDropColumn]: isOver && !canDrop
        })}
      >
        <h4>{`${title} (${tasks.length})`}</h4>
        <input type="checkbox" checked={isColumnSelected} className={css.selectCard} onClick={this.checkboxHandler}/>
        {tasks.length ? (
          tasks
        ) : (isTasksLoad || isProjectLoading) && !allTasksLength ? (
          <div className={css.cardHolder}>
            <InlineHolder length="70%" />
            <InlineHolder length="100%" />
            <InlineHolder length="30%" />
          </div>
        ) : (
          <span className="text-info">
            {localize[lang].TASKS_ON_STAGE} {title} {localize[lang].EXISTS}
          </span>
        )}
      </div>
    );
  }
}
